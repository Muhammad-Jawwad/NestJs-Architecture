import * as fs from 'fs-extra'
// import * as fs from 'fs';


export const moveImage = (id: number, path: string) => {
    const src = `./public/temp/${path}`
    const dest = `./public/users/${id}/${path}`

    
    // fs.mkdirSync(dest, { recursive: true });

    fs.move(src, dest, { overwrite: true }, err => {
        if (err) return console.error(err)
        console.log('success!')
    })

    return `/uploads/users/${id}/${path}`;
}
