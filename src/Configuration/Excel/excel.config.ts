import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

const uuid = uuidv4();
export const excelStorageConfig = diskStorage({
    destination: (req, file, cb) => {
      const path = `./uploads`;
      console.log(file)
      req['excel'] = `${file.originalname}`;
      req['buffer'] = file.buffer;
      fs.mkdirSync(path, { recursive: true });
      cb(null, path);
    },
    filename: (req, file, cb) => {
      cb(null, req['excel']);
    },
  });