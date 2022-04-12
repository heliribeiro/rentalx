import {
  Router,
} from 'express';
import multer from 'multer';

import { CreateCategoryController } from '../modules/cars/useCases/createCategory/CreateCategoryController';
import { ImportCategoryController } from '../modules/cars/useCases/importCategory/ImportCategoryController';
import { ListCategoryController } from '../modules/cars/useCases/listCategories/ListCategoryController';

const categoryRoutes = Router();

const upload = multer({
  dest: './tmp',
});

const createCategoryController = new CreateCategoryController();
const listCategoryController = new ListCategoryController();
const importCategoryController = new ImportCategoryController();

categoryRoutes.post('/', createCategoryController.handle);

categoryRoutes.get('/', (request, response) => listCategoryController.handle(request, response));

categoryRoutes.post('/import', upload.single('file'), importCategoryController.handle);

export { categoryRoutes };
