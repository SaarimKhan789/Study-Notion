import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import "video-react/dist/video-react.css";
import { Player, BigPlayButton } from "video-react";
import IconBtn from "../../common/IconBtn";
const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playRef = useRef(null);
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);
  const [videoData, setVideoData] = useState([]);
  const [previewSource, setPreviewSource] = useState("");
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setVideoSpecificDetails = async () => {
      // particular coureid sectionid,subsectionid ki vide dikhane ke liye
      if (!courseSectionData?.length) return;
      console.log(
        "Course section Data",
        courseSectionData,
        "section Id",
        sectionId
      );
      if (!courseId || !sectionId || !subSectionId)
        navigate("/dasboard/enrolled-courses");
      else {
        const filteredSectionData = courseSectionData.filter(
          // kaunsa section ki video dikhani hai
          (section) => section._id === sectionId
        );
        console.log("filteredSectionData", filteredSectionData);
        if (!filteredSectionData?.length) {
          console.log("Section not found");
          return;
        }

        const filteredVideoData = filteredSectionData[0]?.subSection?.filter(
          // kaunsi video ko show karna hai
          (lecture) => lecture._id === subSectionId
        );
        if (!filteredVideoData?.length) {
          console.log("Video not found");
          return;
        }
        setVideoData(filteredVideoData[0]);
        setPreviewSource(courseEntireData.thumbnail);
        setVideoEnded(false);
      }
    };
    setVideoSpecificDetails();
  }, [courseSectionData, courseEntireData, location.pathname]);

  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentsubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId);
    if (currentsubSectionIndex === 0 && currentSectionIndex === 0) return true;
    return false;
  };
  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const noOfSubsections =
      courseSectionData[currentSectionIndex].subSection.length;

    const currentsubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId);

    if (
      currentSectionIndex === courseSectionData.length - 1 &&
      currentsubSectionIndex === noOfSubsections - 1
    )
      return true;
    return false;
  };
  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData?.findIndex(
      (data) => data._id === sectionId
    );
    const noOfSubsections =
      courseSectionData[currentSectionIndex]?.subSection?.length;

    const currentsubSectionIndex = courseSectionData[
      currentSectionIndex
    ]?.subSection?.findIndex((data) => data._id === subSectionId);

    if (currentsubSectionIndex !== noOfSubsections - 1) {
      //  same section mein next subsection(videos) par jao
      const nextsubSectionId =
        courseSectionData[currentSectionIndex]?.subSection[
          currentsubSectionIndex + 1
        ]?._id;
      // is video par jao
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextsubSectionId}`
      );
    } else {
      // different section ki first video
      const nextSectionId = courseSectionData[currentSectionIndex + 1]?._id;
      const firstsubSectionId =
        courseSectionData[currentSectionIndex + 1]?.subSection[0]._id;

      // upar vali index ki video par chale jao
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${firstsubSectionId}`
      );
    }
  };
  const goToPrevVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    const currentsubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId);

    if (currentsubSectionIndex !== 0) {
      // same section previous video
      const prevSubSectionId =
        courseSectionData[currentSectionIndex].subSection[
          currentsubSectionIndex - 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      );
    } else {
      // different section ki last video
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
      const prevSubsectionLength =
        courseSectionData[currentSectionIndex - 1].length;
      const prevsubSectionId =
        courseSectionData[currentSectionIndex - 1].subSection[
          prevSubsectionLength - 1
        ]._id;

      // upar vali index ki video par chale jao
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevsubSectionId}`
      );
    }
  };
  async function handleLectureCompletion() {
    setLoading(true);
    const res = await markLectureAsComplete(
      { courseId: courseId, subSectionId: subSectionId },
      token
    );
    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);
  }
  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <Player
          ref={playRef}
          aspectRatio="16:9"
          playsInline
          onEnded={() => setVideoEnded(true)}
          src={videoData?.videoUrl}
        >
          <BigPlayButton position="center" />
          {/* Render When Video Ends */}
          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
            >
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={() => handleLectureCompletion()}
                  text={!loading ? "Mark as complete" : "Loading"}
                  customClasses="text-xl max-w-max px-4 mx-auto"
                />
              )}
              <IconBtn
                disabled={loading}
                onclick={() => {
                  // video ko phirse start karna hai
                  if (playRef?.current) {
                    playRef?.current?.seek(0);
                    setVideoEnded(false);
                  }
                }}
                text="Rewatch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />
              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className="blackButton"
                  >
                    Prev
                  </button>
                )}

                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </Player>
      )}
      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  );
};

export default VideoDetails;
