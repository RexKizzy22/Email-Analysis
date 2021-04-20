import fs from "fs";

interface Data {
    organization: string,
    createdAt: string,
    updatedAt: string,
    products: string[],
    marketValue: string,
    address: string,
    ceo: string,
    country: string,
    id: number,
    noOfEmployees:number,
    employees:string[]
};

type Promisify = Promise<Data | string | undefined>;

type URL = string | undefined;

async function readFile() {
    try {
        const files: Buffer = await fs.promises.readFile("./database.json");
        return JSON.parse(files.toString());
    } catch (error) {
        if (error) {
            await fs.promises.writeFile("database.json", JSON.stringify([]));
            const files: Buffer = await fs.promises.readFile("./database.json");
            return JSON.parse(files.toString());
        }
    }
}


const api = {
    get: async () => {
        const files = await readFile();
        return files;
    },
    getOne: async (id: URL): Promisify => {
        if (id) {
            try {
                const bufferFile = await fs.promises.readFile("./database.json");
                const fileArray = JSON.parse(bufferFile.toString());
    
                for (let data of fileArray) {
                    if (data.id === parseInt(id)) {
                        return data;
                    }
                }
    
            } catch (error) {
                if (error) {
                    console.log(error);
                    return "File not found";
                }
            }

        }
    },
    post: async (data: Data): Promise<Data | undefined> => {
        try {
            const bufferFile = await fs.promises.readFile("./database.json");
            const fileArray = JSON.parse(bufferFile.toString());
            const lastItem = fileArray[fileArray.length - 1];
            data.id = lastItem.id + 1;

            fileArray.push(data);

            await fs.promises.writeFile("./database.json", JSON.stringify(fileArray, null, 2));
            return data;
                
        } catch (error) {
            if (error) {

                const fileArray = await readFile();
                const id = 1;
                data.id = id;
    
                fileArray.push(data);
    
                await fs.promises.writeFile("./database.json", JSON.stringify(fileArray, null, 2));
                return data;
            }
        }

    },
    put: async (id: URL, data: Data): Promisify => {
        if (id) {
            try {
                const bufferFile = await fs.promises.readFile("./database.json");
                const fileArray = JSON.parse(bufferFile.toString());
                let newData;
        
                for (let [index,file] of fileArray.entries()) {
                    if (parseInt(id) === file.id) {
                        newData = {...file, ...data};
                        fileArray.splice(index, 1, newData);
                        break;
                    }
                }
        
                await fs.promises.writeFile("./database.json", JSON.stringify(fileArray, null, 2));
                return newData;
                
            } catch (error) {
                if (error) console.log("Error occured: ", error);
                return "File not found";
            }
        }
    },
    delete: async (id: URL): Promisify => {
        if (id) {
            try {
                const bufferFile = await fs.promises.readFile("./database.json");
                const fileArray = JSON.parse(bufferFile.toString());
                let unwanted;
        
                for (let [index, file] of fileArray.entries()) {
                    if (file.id === parseInt(id)) {
                        unwanted = fileArray.splice(index, 1);
                        break;
                    }
                }
        
                await fs.promises.writeFile("./database.json", JSON.stringify(fileArray, null, 2));
                return unwanted[0];
                
            } catch (error) {
                if (error) console.log("Error occured: ", error);
                return "File not found";
            }

        }
    }
}

export default api;