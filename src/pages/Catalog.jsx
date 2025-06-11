// import React, { useEffect, useState } from 'react'
// import Footer from '../components/common/Footer'
// import { useParams } from 'react-router-dom'
// import { apiConnector } from '../services/apiconnector';
// import { categories } from '../services/apis';
// import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
// import Course_Card from '../components/core/Catalog/Course_Card';
// import CourseSlider from '../components/core/Catalog/CourseSlider';

// const Catalog = () => {

//     const {catalogName} = useParams();
//     const [catalogPageData, setCatalogPageData] = useState(null);
//     const [categoryId, setCategoryId] = useState("");

//     //Fetch all categories
//     useEffect(()=> {
//         const getCategories = async() => {
//             const res = await apiConnector("GET", categories.CATEGORIES_API);
//             const category_id = 
//             res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
//             setCategoryId(category_id);
//         }
//         getCategories();
//     },[catalogName]);

//     useEffect(() => {
//         const getCategoryDetails = async() => {
//             try{
//                 const res = await getCatalogaPageData(categoryId);
//                 console.log("PRinting res: ", res);
//                 setCatalogPageData(res);
//             }
//             catch(error) {
//                 console.log(error)
//             }
//         }
//         if(categoryId) {
//             getCategoryDetails();
//         }
        
//     },[categoryId]);


//   return (
//     <div className='text-white'>

//         <div>
//             <p>{`Home / Catalog /`}
//             <span>
//                 {catalogPageData?.data?.selectedCategory?.name}
//             </span></p>
//             <p> {catalogPageData?.data?.selectedCategory?.name} </p>
//             <p> {catalogPageData?.data?.selectedCategory?.description}</p>
//         </div>

//         <div>
//             {/* section1 */}
//             <div>
//             <div>Courses to get you started</div>
//                 <div className=' flex gap-x-3'>
//                     <p>Most Popular</p>
//                     <p>New</p>
//                 </div>
//                 <div>
//                     <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses} />
//                 </div>
//             </div>  

//             {/* section2 */}
//             <div>
//             <div>Top Courses in {catalogPageData?.data?.selectedCategory?.name}</div>
//                 <div>
//                     <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses}/>
//                 </div>
//             </div>

//             {/* section3 */}
//             <div>
//                 <div>Frequently Bought</div>
//                 <div className='py-8'>

//                     <div className='grid grid-cols-1 lg:grid-cols-2'>

//                         {
//                             catalogPageData?.data?.mostSellingCourses?.slice(0,4)
//                             .map((course, index) => (
//                                 <Course_Card course={course} key={index} Height={"h-[400px]"}/>
//                             ))
//                         }

//                     </div>

//                 </div>
//             </div>

//         </div>
//     <Footer />
//     </div>
//   )
// }

// export default Catalog

import React, { useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import { useParams } from "react-router-dom";
import { apiConnector } from "../services/apiconnector";
import { categories } from "../services/apis";
import { getCatalogPageDetails } from "../services/operations/pageAndComponentData";
import CourseCard from "../components/core/Catalog/CourseCard";
import CourseSlider from "../components/core/Catalog/CourseSlider";

const Catalog = () => {
  const { catalogName } = useParams(); // store karega kaunsi catgrory par click kiya hai maine isliyre params se mangva diya hai
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [active, setActive] = useState(1);
  // Fetch all Categories
  async function getCategories() {
    // saari catgegrieis nijkali
    const response = await apiConnector("GET", categories.CATEGORIES_API);
    // jis catgory par click kiya hai uski catgroy ki id nikali
    const category_id = response?.data?.data?.filter(
      (ct) =>
        ct.name.split(" ").join("-").toLowerCase() === catalogName.toLowerCase()
    )[0]._id;
    setCategoryId(category_id); // jo nayi catgriy selct kari hai voh set hogayi
  }
  useEffect(() => {
    getCategories();
  }, [catalogName]); // jab catgoryId  change hogi yab yeh call hofi taaki category chnage ho ske jo jo nayi nayi catrory humnse chahi hai dekhan voh set ho ske setCatgoryId mein

  async function getCategoryDetails() {
    try {
      const response = await getCatalogPageDetails(categoryId);
      setCatalogPageData(response); // jo catagory dekhni thi uske saari details isme gayi hai yaani saare courses topselling,diffrenct catgroies, same catgoris course etc
      //   console.log("Most selling courses",catalogPageData?.data?.mostSellingCourses?.slice(0,4).map((course,index)=>{
      //     console.log(index,"course",course?.thumbnail)
      //   }))
    } catch (error) {
      console.log(error);
    }
  }
  // jaise hee nayi category set hui tab neeche wala useffetc run hoga taaki us catgory ki saari details render hojaye yunki yeh process har baad hoga jab user select nayi category select karega isliuye useffect use hua hai
  useEffect(() => {
    if (categoryId) getCategoryDetails();
  }, [categoryId]); // jab catgoryId  chnage hogi tab yeh call hoga taaki iske courses dikha sake
  return (
    <div className=" box-content bg-richblack-800 px-4">
      <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
        <p className="text-sm text-richblack-300">
          {`Home /Catalog/ `}{" "}
          <span className="text-yellow-25">
            {catalogPageData?.data?.selectedCategory?.name}
          </span>
        </p>
        <p className="text-richblack-5 font-bold text-3xl">
          {catalogPageData?.data?.selectedCategory?.name}
        </p>
        <p className="max-w-[870px] text-richblack-300 font-bold text-md">
          {catalogPageData?.data?.selectedCategory?.description}
        </p>
      </div>
      <div>
        {/* section 1 */}
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          <div className="text-richblack-5 font-bold text-3xl">
            Courses to get you Started
          </div>
          <div className="my-4 flex border-b border-b-richblack-600 text-sm">
            <p
              className={`px-4 py-2 ${
                active === 1
                  ? "border-b border-b-yellow-25 text-yellow-25"
                  : "text-richblack-50"
              } cursor-pointer`}
              onClick={() => setActive(1)}
            >
              Most Popular
            </p>
            <p
              className={`px-4 py-2 ${
                active === 2
                  ? "border-b border-b-yellow-25 text-yellow-25"
                  : "text-richblack-50"
              } cursor-pointer`}
              onClick={() => setActive(2)}
            >
              New
            </p>
          </div>
          <div>
            <CourseSlider
              Courses={catalogPageData?.data?.selectedCategory?.courses}
            />
          </div>
        </div>
        {/* section 2 */}
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          <p className="text-richblack-5 font-bold text-3xl">
            Top Courses in {catalogPageData?.data?.differentCategory?.name}
          </p>
          <div className="py-8">
            <CourseSlider
              Courses={catalogPageData?.data?.differentCategory?.courses}
            />
          </div>
        </div>

        {/* section3 */}
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          <div className="text-richblack-5 font-bold text-3xl">
            Frequenty bought
          </div>
          <div className="py-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {catalogPageData?.data?.mostSellingCourses
                ?.slice(0, 4)
                .map((course, index) => (
                  <CourseCard course={course} key={index} Height={"h-[400px"} />
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Catalog;

