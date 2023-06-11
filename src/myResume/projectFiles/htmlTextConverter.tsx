import  {FileList, WindowState} from '../../layouts/codeDemoWindow/CodeWindow';
import  {items} from '../../layouts/contentCarousel/contentCarosel';

 
let CaroselItem : items =    {
    Subject : "HtmlTextConverter_Title",
    Description : "This is description for iteThis is description for itemThis is description for itemThis is description for itemThis is description for itemThis is description for itemThis is description for itemThis is description for itemThis is description for itemThis is description for itemThis is description for itemmThis is description for item " , 
    img_Url:"https://i.ibb.co/xL2gDKR/ime.png",
    file_List : [
        {
            key : 1,
            FileTitle : "main.java",
            content : 

                "<<purple/>public class <<white/>main" +
                "<<br,white/>{" +
                    "<<<sp_1,br/>  <<purple/>public static void <<white/>main(String [] args) <<purple/> throws <<white/> Exception"+
                    "<<br,white/>{" +
                        "<<<sp_2/>" + 
                            "<<green/>fileBuffer <<white/>inputFile = <<purple/>new <<white/>fileBuffer('inputFile.txt');" +
                            "<<br/> <<green/>fileBuffer <<white/> outputFile = <<purple/> new <<white/> fileBuffer('MyNotes.html');"+
                            "<<br/> <<green/>HtmlGenerator <<white/> html_Generator = <<purple/>new <<white/>HtmlGenerator(inputFile, outputFile);" +
                    "<<<sp_1,br/>}"+
                "<<<sp_0,br/>}"
            
        },
        {
            key : 2,
            FileTitle : "HtmlGenerator.java",
            content :   "<<<sp_0/> <<lightblue/>import <<white/>java.io.StringWriter;"+
                        "<<br/> <<lightblue/>import <<white/> java.util.ArrayDeque;"+
                        "<<br/> <<lightblue/>import <<white/> java.util.Iterator;"+
                        "<<br/> <<lightblue/>import <<white/> java.util.Queue;"+


                        "<<\n/>"+
                        "<<<br,sp_0/> <<purple/> public class <<white/> HtmlGenerator" +
                        "<<br,white/>}" +
                            "<<<br,sp_1/>" +
                            "<<green/>fileBuffer <<white/>input_Buffer;"+
                            "<<br/> <<green/>fileBuffer <<white/>output_Buffer;"+
                            "<<br/> <<purple/>private static <<green/>String <<white/>head_Wrapper;"+
                            "<<br/> <<purple/>private static <<green/>String <<white/>tail_Wrapper;"+
                            "<<br/> <<purple/>private static <<green/>String <<white/>local_ImageFolder = ''./Images/';"+
                            "<<br,purple/>private static <<white/>{" +
                                "<<<br,sp_2/> <<green/> head_Wrapper <<white/>= '<!DOCTYPE html> <html> <head> <title> MyNotes </title> </head> <body style ='white-space: nowrap;'>';" +
                                "<<<br,sp_2/> <<green/>tail_Wrapper <<white/>= '</body> </html>';" +
                            "<<<sp_1,br/>}"+

                            "<<\n/>"+

                            "<<<sp_1,br/> <<lightblue/>HtmlGenerator <<white/>( fileBuffer inputBuffer, fileBuffer outputBuffer )"+
                            "<<br,white/>{"+
                                "<<<br,sp_2/>"+
                                "<<br/> <<purple/>System.<<white/>out.println('Initialising HTMLGenerator');"+
                                "<<br/> <<white/>input_Buffer = inputBuffer;"+
                                "<<br/> <<white/>output_Buffer = outputBuffer;"+
                                "<<br,green/>try <<white/>{"+
                                    "<<<sp_3,br/> <<white/>outputBuffer.clearFile();"+
                                "<<<sp_2,br/> <<white/>} <<green/>catch <<white/> ( <<purple/>Exception  <<white/>i) {"+
                                    "<<<sp_3,br/>" +
                                    "<<br,white/>System.out.printf(' --> Error clearing output_Buffer\n  --> HTML-Generator initialisation failed! - SysExit');"+
                                    "<<br,white/>System.exit(0);"+
                                "<<<sp_2,br/>}"+
                                "<<br,white/>System.out.println('  --> Html Generator established!');"+
                            "<<<br,sp_1/> <<white/>}" +





                            "<<\n/>"+
                            "<<<sp_1,br/> <<purple/>private void <<white/>insertTailWrapper()" + 
                            "<<br,white/>{"+
                                "<<<br, sp_2/>"+
                                "<<br,white/>System.out.println('  --> Inserting TailWrapper');"+
                                "<<br,green/>try <<white/>{ "+
                                    "<<<sp_3,br/> <<yellow/>for <<white/>(<<green/>int <<white/>i=0; i < tail_Wrapper.length() ;i++)"+
                                        "<<<sp_4,br/> <<white/>output_Buffer.insertChar(tail_Wrapper.charAt(i));   "+
                                    "<<<sp_2,br/>}  <<green/>catch <<white/> (<<purple/>Exception <<white/> k )"+
                                "<<br/> <<white/>{"+
                                    "<<<sp_3,br/>" +
                                    "<<br,white/> System.out.printf (' .  --> error inserting tailWrapper %s/n --> sysexit! ' + k.getMessage());"+
                                    "<<br,white/>System.exit(0);"+
                                "<<<sp_2,br/>"+
                                "<<br,white/>}"+
                                "<<br,white/>System.out.println('    --> tail-Wrapper insertion successful established! ');" +
                            "<<<sp_1,br/>}"+

                            "<<\n/>"+

                            "<<<sp_1,br/> <<purple/>private void <<white/>insertHeadWrapper()"+ 
                            "<<br,white/>{"+
                                "<<<sp_2,br/>"+
                                "<<br,white/>System.out.println(' --> Inserting headWrapper');"+
                                "<<br,green/> try" + 
                                "<<br,white/>{"+
                                    "<<<sp_3,br/>" +
                                    "<<br/> <<yellow/>for <<white/>(<<green/>int <<white/>i=0; i < head_Wrapper.length() ;i++)"+
                                        "<<<sp_4/> output_Buffer.insertChar(head_Wrapper.charAt(i));"+   
                                "<<<sp_2/>} <<green/>catch <<white/>(<<purple/>Exception <<white/>k ) { "+
                                    "<<<sp_3,br/>" +
                                    "<<br,white/>System.out.printf (' .  --> error inserting headers %s/n --> sysexit! '' + k.getMessage());"+
                                    "<<br,white/>System.exit(0);"+
                                "<<<sp_2,white/>}"+
                                "<<br,white/>System.out.println('    --> Header insertion successful established! '');" +
                            "<<<sp_1,br/>}"+

                            "<<<br,sp_0,white/> <<white/> } " 
        },
        {
            key : 3,
            FileTitle : "call.java",
            content :  "Description : Given an array A of integers, we return The array in sorted order (if any exist) . " +
            "Sorting takes O(n2) worse time, but averages At O(nlog2n) time complexity "
        },
    ],
}

export default CaroselItem;