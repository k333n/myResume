import React from "react";
/* ------------------------------------------ Class Description ------------------------------------------
    Directory related functions that are used in processing files (i.e. images) relative to the file-system
    of the residing user when application is bundled and sent to the end-user. Using relative-path in development
    enivironment often will not work in context of production environment, hence we utilise tools (i.e., webkit)
    to guarentee correctivness for path handling. This is the behaviour of the browser, and the best-standards 
    propsed for the www. 
------------------------------------------------------------------------------------------------------------*/

/* 
    NodeRequire Interface description :
        The NodeRequire interface is a part of the Node.js JavaScript runtime environment, it provides a way to 
        load and use modules in a Node.js application. The require() function is used to load a module and returns 
        an object that represents the module's exports. The NodeRequire interface is the type that is returned by 
        the require() function and it has properties and methods that can be used to access the exports of the 
        loaded module.

        The NodeRequire Interface must be inherited by calling class for typescript based project, and is used as 
        a blueprint, an object of its type is expected for the functions of this component, this is created by the
        require.context() function, this function is not a React specific api, nor is it a native browser api (for now), 
        but comes from commonJS. 

        Here, declare keyword is used to tell the TypeScript compiler that the require variable is a global variable 
        that is defined elsewhere (e.g. in a third-party library). It does not actually define the require variable, 
        it just tells the compiler that the variable exists

        The NodeRequire type is a type provided by the TypeScript standard library that represents the require function 
        in the Node.js runtime. It is used to import modules in a Node.js application, and the context Object defines 
        the require.context() function which is described below (Ref : 3331). 


     require.Context Function : (Ref : 3331).
        The require.context function returns a NodeRequire_Object, it is a way to create a new context 
        that allows you to require modules within a given directory.

        require.Context takes as parameter a directory to search, a flag indicating whether subdirectories should be searched too, 
        and a regular expression to match files against. A recurive trace/traversal is assumed to be perfoemd by some given root-directory. 
            
        The require.Context function is important because In a production environment, the relative URL solution may not work because the file system may 
        be different and the path to the image is not guaranteed to be correct, this is the behaviour of webkit and the browser, where
        code are bundled and transmiteed to the user, we can visualise this through chrome>devlopertools > sources. 
        A simple console.log()on the 'const images = context.keys().map(context);' array will show the relative path. 

        Passing Parameters :
            1) String : The directory to search for modules. This can be either an absolute path or a path relative to the current directory (Calling class).
            2) boolean: A flag indicating that subdirectories should also be searched.
            3) Reguare expression : i.e. : /\.js$ that specifies which files should be included in the context. 
                I.e : /^.*\/(t|anotherFileName)\.(jpg|jpeg)$/ 
                    This will create a context that includes only files in the current directory that starts with 'myFileName' or 
                    'anotherFileName' and end with '.jpg' or '.jpeg'

    Interface Declaration Example :
        require.context( `./templat1Images`, false, /^.*\/(t|anotherFileName)\.(jpg|jpeg)$/ ); // returns the NodeRequire & { context?: any };

        
*/
declare const require: NodeRequire & { context?: any };



class dirHandling 
{
    /* 
        Function Description (getImageUrls): 
            Given some context by webkits require.context, Func getImageUrl returns an array of string-urls of all 
            files satisfying the : png, jpeg format. These urls are relative to the path of the end-user and not developnment 
            environment. 

            The calling class must inherit the 'require: NodeRequire & { context?: any };' interface if used within the 
            context of typescript. 
        Returns :
            Relative path(s) of file in context. 

    */
    getLocalFilePath (context : NodeRequire & { context?: any } & any) : string[]
    {
        let toRet : string[] = [];
        const images = context.keys().map(context);
        images.forEach((image : string) => 
        {
            toRet.push(image);
        });
        return toRet;
    }

}

export default dirHandling;