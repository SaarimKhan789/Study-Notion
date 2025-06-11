const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");

exports.updateCourseProgress = async (req, res) => {
  console.log("Hello");
  const { courseId, subSectionId } = req.body;
  //console.log("courseId, subSectionId", courseId, subSectionId);
  const userId = req.user.id;

  try {
    const subSection = await SubSection.findById(subSectionId);
    //console.log("Subsection", subSection);
    if (!subSection) {
      return res.status(404).json({ error: "Invalid subsection" });
    }

    let courseProgress = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });
    console.log("courseProgress", courseProgress);
    if (!courseProgress) {
      return res
        .status(404)
        .json({ success: false, message: "Course progress does not exist" });
    } else {
      // check for re completing video/subsection
      if (courseProgress.completedVideos.includes(subSectionId)) {
        return res
          .status(400)
          .json({ success: false, message: "Subsection is already completed" });
      }
      // push into complted video
      courseProgress.completedVideos.push(subSectionId); // complted videos mein add kardiya subsection
      await courseProgress.save();
      return res.status(200).json({
        success: true,
        message: "Course Progress updaed successfully",
        data: courseProgress,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
