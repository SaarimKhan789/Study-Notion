import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IoIosArrowBack } from "react-icons/io";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import { BsChevronDown } from "react-icons/bs";

const VideoDetailsSideBar = ({ setReviewModal }) => {
  const [activeSection, setActiveSection] = useState(""); // kaunsa active section
  const [videoBarActive, setVideoBarActive] = useState(""); // kaunsa active subsection
  const location = useLocation();
  const navigate = useNavigate();
  const { sectionId, subSectionId } = useParams();
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  async function activeSectionAndSubsectionDetails() {
    // shuruvaat mein pehla section ka pehla subsection highlight hoga isliye useffect
    if (!courseSectionData?.length) return;
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentsubSectionIndex = courseSectionData?.[
      currentSectionIndex
    ]?.subSection.findIndex((data) => data._id === subSectionId);
    // jo lecture mera abhi khula pada hai
    const activeSubsectionId =
      courseSectionData[currentSectionIndex]?.subSection?.[
        currentsubSectionIndex
      ]?._id;
    setActiveSection(courseSectionData?.[currentSectionIndex]?._id);
    setVideoBarActive(activeSubsectionId);
  }
  useEffect(() => {
    activeSectionAndSubsectionDetails();
  }, [courseSectionData, courseEntireData, location.pathname]); // jab bhi sectiondata,subsectiondata,urldata chnage ho tab call karna
  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
          {/* for buttons and headings */}
          <div className="flex w-full items-center justify-between ">
            {/* for buttons */}
            <div
              onClick={() => {
                navigate("/dashboard/enrolled-courses");
              }}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
              title="back"
            >
              <IoIosArrowBack size={30} />
            </div>

            <IconBtn
              text={"Add Review"}
              customClasses="ml-auto"
              onclick={() => setReviewModal(true)}
            />
          </div>
          {/* for headings or title */}
          <div className="flex flex-col">
            <p>{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>
        </div>

        {/* for sections and subsections */}
        <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
          {courseSectionData.map((section, index) => (
            <div
              className="mt-2 cursor-pointer text-sm text-richblack-5"
              onClick={() => setActiveSection(section?._id)}
              key={index}
            >
              {/* section */}
              <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                <div className="w-[70%] font-semibold">
                  {section?.sectionName}
                </div>
                <div className="flex items-center gap-3">
                  {/* <span className="text-[12px] font-medium">
                    Lession {course?.subSection.length}
                  </span> */}
                  <span
                    className={`${
                      activeSection === section?.sectionName
                        ? "rotate-0"
                        : "rotate-180"
                    } transition-all duration-500`}
                  >
                    <BsChevronDown />
                  </span>
                </div>
              </div>

              {/* subsections */}

              {activeSection === section?._id && (
                <div className="transition-[height] duration-500 ease-in-out">
                  {section?.subSection.map((lecture, index) => (
                    <div
                      className={`flex gap-3  px-5 py-2 ${
                        videoBarActive === lecture._id
                          ? "bg-yellow-200 font-semibold text-richblack-800"
                          : "hover:bg-richblack-900"
                      }`}
                      key={index}
                      onClick={() => {
                        navigate(
                          `/view-course/${courseEntireData?._id}/section/${section?._id}/subSection/${lecture?._id}`
                        ); // video dikhane chale jao
                        setVideoBarActive(lecture._id);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={completedLectures.includes(lecture?._id)}
                        onChange={() => {}}
                      />
                      {lecture.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default VideoDetailsSideBar;
