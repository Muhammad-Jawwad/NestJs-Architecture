import * as fs from 'fs-extra'
// import * as fs from 'fs';


export const moveBlogImage = (path: string) => {
    const src = `./public/temp/${path}`
    const dest = `./public/blogs/${path}`

    
    // fs.mkdirSync(dest, { recursive: true });

    fs.move(src, dest, { overwrite: true }, err => {
        if (err) return console.error(err)
        console.log('success!')
    })

    return `/uploads/blogs/${path}`;
}
