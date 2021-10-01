import { ISpecificationsRepository } from '../../repositories/ISpecificationsRepository';

interface IRequest {
  name: string;
  description: string;
}

class CreateSpecificationUseCase {
  constructor(private specificationsRepository:ISpecificationsRepository) {}
  execute({ name, description }:IRequest): void {
    const specificationAlreadExists = this.specificationsRepository.findByName(name);
    if (specificationAlreadExists) {
      throw new Error('Specificaions Alread Exists.');
    }

    this.specificationsRepository.create({ name, description });
  }
}

export { CreateSpecificationUseCase };
