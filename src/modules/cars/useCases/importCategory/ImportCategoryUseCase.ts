import CSVParse from 'csv-parse';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';

import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';

interface IImportCategories {
  name: string;
  description:string;
}

@injectable()
class ImportCategoryUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}
  loadCategories(file:Express.Multer.File):Promise<IImportCategories[]> {
    return new Promise((resolve, reject) => {
      const categories:IImportCategories[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = CSVParse();

      stream.pipe(parseFile);

      parseFile.on('data', async (line) => {
        const [name, description] = line;
        categories.push({ name, description });
      })
        .on('end', () => {
          fs.promises.unlink(file.path);
          resolve(categories);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async execute(file:Express.Multer.File):Promise<void> {
    const categories = await this.loadCategories(file);

    categories.map(async ({ name, description }) => {
      const categoryAlreadExists = await this.categoriesRepository.findByName(name);
      if (!categoryAlreadExists) {
        await this.categoriesRepository.create({ name, description });
      }
    });
  }
}

export { ImportCategoryUseCase };
