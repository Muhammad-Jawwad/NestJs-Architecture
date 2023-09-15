
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

const uuid = uuidv4();
export const imageStorageConfig = diskStorage({
    destination: (req, file, cb) => {
      const path = `./public/temp`;
      console.log(file)
      req['picture'] = `${uuid}-${encodeURI(file.originalname)}`;
      fs.mkdirSync(path, { recursive: true });
      cb(null, path);
    },
    filename: (req, file, cb) => {
      cb(null, `${uuid}-${file.originalname}`);
    },
  });