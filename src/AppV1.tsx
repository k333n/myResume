import React, {Suspense, useRef, useLayoutEffect, useState, useEffect} from "react";
import Grid from "./layouts/gridFrame"
import ScrollAnimation from './animations/AnimationScroller/scrollAnimation'
import AnimationSlider from './animations/AnimationPictureSlider/animationPictureSlider'
import AnimationElipseContainer from './animations/AnimationPageScrollContainer/AnimationContainer';
import ElipseContainer  from  './animations/AnimationPageScrollContainer/Template/ElipseContainer';
import ReverseElipseContainer  from  './animations/AnimationPageScrollContainer/Template/ReverseEclipseContainer';
import ScrollCircleTemplate from './animations/AnimationScroller/Templates/circle'
import ResourceFrame, {ContentInterface} from './layouts/ResourceFrame';
import DynamicText from './layouts/dynamicText'
import img from './t.jpeg' 
import myBrowser from './browserHandling/myBrowser'
import ImageFramee from "./layouts/imageFrame"
import ScrollBarMenu, {ScrollBarElement} from "./layouts/scrollBarMenu/ScrollBarMenu"
import BarChart, {CategoryItem, SubjectItem} from "./layouts/barChart/barChart";
import { text } from "node:stream/consumers";
import Imageframe from './layouts/imageFrame'
import SimpleButtom from './buttons/simpleButton2/simpleButton2';
// import DownArrow from './buttons/SimpledownArrow/SimpleDownArrow';
import ToggleButtom from './buttons/ToggleButton/ToggleButton';
import ProfileBanner, {AnimationBannerInformation} from './animations/AnimationBannerProfile/AnimationBanner';
import DownArrow from './buttons/AnimateddownArrow/downArrow';
import ContentCarosel from './layouts/contentCarousel/contentCarosel';

const AboutMe = React.lazy(() => import('./aboutMe/aboutme'));
const CodeAnimationBlock = React.lazy(() => import('./animations/AnimationText/TextAnimation'));
declare const require: NodeRequire & { context?: any };

function App() {


  let [reRendeer, setReRender] = useState(1);
  
  // let somecontent : ContentInterface []= [
  //   {
  //     Key : 1,
  //     Title : "content1", 
  //     Description : "content1content1content1content1content1content1content1content1content1content1content1content1content1",
  //     animationFolderURL : "Adsf",
  //   },
  //   {
  //     Key : 2,
  //     Title : "content2", 
  //     Description : "content1content1",
  //     animationFolderURL : "Adsf"
  //   },
  //   {
  //     Key : 3,
  //     Title : "content3", 
  //     Description : "content1content1",
  //     animationFolderURL : "Adsf"
  //   },
  //   {
  //     Key : 4,
  //     Title : "content4", 
  //     Description : "asdf",
  //     animationFolderURL : "Adsf"
  //   },
  //   {
  //     Key : 5,
  //     Title : "content5", 
  //     Description : "asdf",
  //     animationFolderURL : "Adsf"
  //   },
  //   {
  //     Key : 6,
  //     Title : "content", 
  //     Description : "asdf",
  //     animationFolderURL : "Adsf"
  //   },
  // ]



 

  let scrollbarelements : ScrollBarElement[]=
  [
    {
      reference : useRef<HTMLDivElement>(null),
      name : "overview"
    },
    {
      reference : useRef<HTMLDivElement>(null),
      name : "BarChart"
    },
    {
      reference : useRef<HTMLDivElement>(null),
      name : "MyProjects"
    },
  ]

  useLayoutEffect(
    () => {
      setReRender(reRendeer+=1);
    }, []
  )
  

  let CItems : CategoryItem []= [
    {
      Title : "PROGRAMMING LANGUAGES",
      elements : 
      [
        {
          name : "Javaa",
          percentage : 50,
          color_Theme : "red"
        },
        {
          name : "C/C++",
          percentage : 50,
          color_Theme : "blue"
        },
        {
          name : "JavaScript",
          percentage : 13,
          color_Theme : "red"
        },
        {
          name : "typeScript in javascript",
          percentage : 11,
          color_Theme : "purple"

        },
        {
          name : "typeSctypeScript only",
          percentage : 5,
          color_Theme : "red"

        },

      ]
    },
    {
      Title  : "DATASTRUCTURE",
      elements : 
      [
        {
          name : "PSA",
          percentage : 15,
          color_Theme : "yellow"

        },
        {
          name : "safasfas",
          percentage : 99,
          color_Theme : "red"

        },
        {
          name : "asdfasf",
          percentage : 100,
          color_Theme : "blue"

        },
        {
          name : "PsadfasfasfdasdA",
          percentage : 95,
          color_Theme : "red"

        },
      ]
    },
    {
      Title  : "ALGORITHM",
      elements : 
      [
        {
          name : "PSA2",
          percentage : 11,
          color_Theme : "red"

        },
        {
          name : "PSA",
          percentage : 35,
          color_Theme : "blue"

        }
      ]
    },
    {
      Title  : "DESIGNS",
      elements : 
      [
        {
          name : "PSA",
          percentage : 55,
          color_Theme : "red"

        }
      ]
    } ,
    {
      Title  : "ART",
      elements : 
      [
        {
          name : "gdesign",
          percentage : 14,
          color_Theme : "red"

        },
        {
          name : "asfasf",
          percentage : 509,
          color_Theme : "red"

        },
        {
          name : "55",
          percentage : 55,
          color_Theme : "red"

        },
        {
          name : "553",
          percentage : 33,
          color_Theme : "red"

        },
        {
          name : "332",
          percentage : 11,
          color_Theme : "red"
        },
      ]
    } 
  
  
  ]; 

  let DItems : CategoryItem []= [
    {
      Title : "Layout Concept",
      elements : 
      [
        {
          name : "UI Design",
          percentage : 50,
          color_Theme : "red"

        },
        {
          name : "C/UI Design++",
          percentage : 50,
          color_Theme : "red"

        },
        {
          name : "colouring",
          percentage : 13,
          color_Theme : "red"

        },
        {
          name : "scheme",
          percentage : 11,
          color_Theme : "red"

        },
        {
          name : "layout",
          percentage : 5,
          color_Theme : "red"

        },
      ]
    },
    {
      Title : "Picture Concept",
      elements : 
      [
        {
          name : "UX Design",
          percentage : 11,
          color_Theme : "red"

        },
        {
          name : "C/colouring++",
          percentage : 22,
          color_Theme : "red"

        },
        {
          name : "colouringscheme",
          percentage : 33,
          color_Theme : "red"

        },
        {
          name : "layoutscheme",
          percentage : 44,
          color_Theme : "red"

        },
        {
          name : "schemelayout",
          percentage : 55,
          color_Theme : "red"
        },
      ]
    },

  ];

  let SubjectItems : SubjectItem[] = [
    {
      Name : "CompSci",
      CategoryItems : CItems
    },
    {
      Name : "Design",
      CategoryItems : DItems
    }
  ]


  let profileBanner : AnimationBannerInformation = 
  {
    title_Left : "</Coder>",
    title_Right : "<Design>",
    desc_Left : "Front end developer who writes clean, elegant and efficient code.",
    desc_Right : "Product designer specialising in UI design and design systems.",
    image_LeftURL : "https://i.postimg.cc/sxq9sW-7v/1.jpg",
    image_RightURL : "https://i.postimg.cc/brsH7gG7/2.jpg"
  }
   
  let textRef = useRef<HTMLParagraphElement>(null);
  let Add = useRef<HTMLParagraphElement>(null);
  let Minus = useRef<HTMLParagraphElement>(null);
  let handleAction = () =>{ 
    console.log("Handling Act!");
  }
  return (
     
    <>
  
      {/* <ScrollBarMenu ScrolBarElements={scrollbarelements}/>

      <div id = {"overview"} ref = {scrollbarelements[0].id} style = { {  width : '100vw', height : '900px', backgroundColor :'red', overflow :'hidden', position :'relative'} }> 
        <div style ={{width:'100%', height:'100%',  paddingLeft : '5%', paddingRight :'5%', boxSizing:'border-box', backgroundColor :'white'}}>
          <ProfileBanner AnimationBarInfo={profileBanner}/>
        </div>
      </div>

      <div id = {"barChart"} ref = {scrollbarelements[1].id} style = { { width : '100vw', height : '100vh', backgroundColor:'#f1f5f9', padding:'3%', boxSizing:'border-box'} }> 
        <div style = { { width : '100%', height : '100%', backgroundColor:'white'} }> 
            <BarChart SubjectItems = {SubjectItems}/>
        </div>
      </div> */}


      {/* <div id = {'myProjects'} ref = {scrollbarelements[2].id} style = {{width:'100vw', height :'100vh',backgroundColor:'white' }}>
            <ContentCarosel/>
      </div> */}
      {/* <div id = {"MyProject"} ref = {scrollbarelements[2].id} style = { {width : '100vw', height : '150vh', backgroundColor :'purple'} }> 
      </div>  */}
     

        {/* <div style = { {width : '100vw', height : '100px', backgroundColor :'red', display:'flex', justifyContent :'center'} }>
            <div style = { {width : '10%', height:'100%', backgroundColor :'blue'}} > 
               <DynamicText Text={"mdasmsd"} Styling = {{color:'white'}}  />
            </div>
        </div>


            {/* <ImageFramee src = {ok[0]} styling = {{}}/> */}

      {/* </div> */}

      <title>My Resume</title>
{/* 
      <div style = { {width : '100vw', height : '100vh'} }>
        <AboutMe/>
      </div> */}

  


      {/* <Suspense fallback = "loading..">  */}
         {/* <Grid width = {1000} height = {1000}> */}
          {/* <div style = { {width : '350px', height : '300px'}}>
            <CodeAnimationBlock text = { "som3thing in bet33nn" }/> 
          </div> */}
          {/* </Grid> */}
      {/* </Suspense>  */}


       {/* <div  style = { {marginLeft : '300px', backgroundColor :'grey', width :'70vw', height : '50vh'}}> 
        <AnimationSlider>
          ss
        </AnimationSlider>
      </div>  */}


      {/* <img src = {`${myBrowser.requestHandling.loadImage("../t.jpeg")}`} /> */}
      {/* require(imagePath); */}
      {/* <img src = {require("./t.jpeg")} /> */}




      {/* <AnimationElipseContainer Template={ElipseContainer}>
      </AnimationElipseContainer>  */}

{/* 
    <AnimationElipseContainer Template={ReverseElipseContainer}>    
    </AnimationElipseContainer> 

      <div style = {{width : '100vw', height : '100vh', backgroundColor :'black', color :'white', fontSize :'100px', textAlign:'center'}}> 
        <ScrollAnimation Template={ScrollCircleTemplate} >
              <div style = { {width : '100%', height : '100%', display : 'flex', justifyContent : 'center', alignItems : 'center', backgroundColor:'white' }}> 
                  <b style ={{fontSize : '59px', color : 'black'}}>YO MAEEE#</b>
              </div>
        </ScrollAnimation> 
      </div>
      
      <div style = { {width : '100vw', height : '100vh', backgroundColor :'red'} }> asd a</div> */}



       {/* <div ref = { parentRef} style = { {width : '50vw', height : '50vh', backgroundColor : 'red', display : 'flex', justifyContent :'center', position : 'relative'}}> 
          <DynamicText Text = { "asfasf"} Styling = {{ display :'flex', alignItems :'center', justifyContent :'center'}}/>
       </div> */}


      {/* In a production environment, the relative URL solution may not work because the file system may be different and the path to the 
          image is not guaranteed to be correct. By using the require() function, webpack takes care of including the image in the bundle 
          and providing a unique URL to reference it. Additionally, the require() function allows you to use dynamic imports, that means you 
          can load a resource only when it is needed. This is particularly useful for lazy loading images or other resources. */}
        {/* <img src={``} /> */}
       
       {/* <ResourceFrame content={somecontent}> 
       </ResourceFrame>  */}

              {/* <div style = { { width : '300px', height :'50px', backgroundColor: 'red'} }> 
                         <DynamicText Text = {"Content1"} Styling = {{wordWrap :'normal',display :'flex', alignItems :'center',} } /> 

                    </div> */}

{/* 
            <div style = { { width : '100vw', height :'100vh', backgroundColor: 'orange'} }> 
                <DynamicText Text = { "asfasf"} Styling = {{display :'flex', alignItems :'center', justifyContent :'center'}}/>
          </div>   */}




    </>

  );
}

export default App;
