

/*
    Utilised to perform browser Get Reques
*/

import React from "react";
import { StringLiteral } from "typescript";

class requestHandling
{
    /* 
        Description : 
                Given an array of urls, getImage(urls) returns a Promise<HTMLImageElement[]> object representation of the given urls   

        Parameters :
            url : Array of strings representative of URLs.
        Returns : 
            1)  on resolve : a Promise<HTMLImageElement[]>  of all urls are given. 
            2)  on reject  : undifined, there exist some url which failed to load!
    */
    getImages = async ( urls : string[] ) : Promise<HTMLImageElement[]> =>
    {
            // console.log("Browser Get Request on image urls being perfomed!");
            let toRetrn  : HTMLImageElement[] | undefined = [];
            let loadImageFunc  = async () => 
            {
                return await new Promise <HTMLImageElement[]> ((resolve, reject)=> 
                {
                    for (let i=0; i < urls.length; i++)
                    {
                        let newImageElement = new Image();
                        newImageElement.src = urls[i];
                        newImageElement.onload = () =>          /* Note : Asycnronous operation (i.e. daemon / background thread), loop may finish before onLoad handler */
                        {
                            if (toRetrn != undefined)
                            {
                                toRetrn.push(newImageElement);
                                if (i == urls.length-1) resolve(toRetrn);
                            }
                        }
                        newImageElement.onerror = () =>
                        {
                            reject();
                        }
                    }
                });
            };
        
            // loadImageFunc().then( 
            //     data =>  /* promise on success */
            //     {
            //         console.log("all loading successful! ");
            //         toRetrn = data;
            //         id = 4;
                    
            //         console.log("we change id = " + id);
            //     },
            //     reject => /* promise on reject */
            //     {
            //         console.log("Error loading all image asset! ");
            //         toRetrn = undefined;
            //     });
        
        
            return loadImageFunc();
    }

      /*
        Description : 
                Given an array of urls, getImage(urls) returns a Promise<HTMLImageElement[]> object representation of the given url.
        Parameters :
            url : Array of strings representative of URLs.
        Returns : 
            1)  on resolve : a Promise<HTMLImageElement[]>  of url are given. 
            2)  on reject  : undifined, loading failed!
    */

    getImage = (imagePath : string) : Promise<HTMLImageElement> =>
    {

        console.log("Browser Get Request on image urls being perfomed : " + imagePath) ;
        let imageToReturn  : HTMLImageElement = new Image();

        let loadImageFunc  = async () => 
        {
            return await new Promise <HTMLImageElement> ((resolve, reject)=> 
            {
                    imageToReturn.src = imagePath;
                    imageToReturn.onload = () =>          /* Note : Asycnronous operation (i.e. daemon / background thread), loop may finish before onLoad handler */
                    {
                        resolve(imageToReturn);
                    }
                    imageToReturn.onerror = () =>
                    {
                        reject();
                    }
            });
        };
        return loadImageFunc();
    }


    /*
        Description : 
            Given some local imagePath, we return the location (URL) of the image that is to be bundled to the end-user in production 
            environment. 

            In a production environment, the relative URL solution may not work because the file system may be different and the path to the 
            image is not guaranteed to be correct. By using the require() function, webpack takes care of including the image in the bundle 
            then transmited to the end user by providing a unique URL to reference it, in fact we can visualise this through 
            chrome>devlopertools > sources. 
            
            Additionally, the require() function allows you to use dynamic imports, that means you 
            can load a resource only when it is needed. This is particularly useful for lazy loading images or other resources. 
        Parameters : 
            imagePath : Some string localPath relative to the calling component.

        Returns : 
            NodeRequire : Relative URL used by <img src= {NodeREquire}/>
    */

    
    // loadImage = (imagePath : string) : NodeRequire => 
    // {

    //     // const fileUrl = new URL(imagePath, 'file://');


    //     //  imagePath = "../t.jpeg";
    //     // console.log(fileUrl.toString)
    //     return require(imagePath);
    // }

    
}

export default requestHandling;