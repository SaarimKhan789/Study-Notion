import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import copy from "copy-to-clipboard";
import Toast, { toast } from "react-hot-toast";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { addToCart } from "../../../slices/cartSlice";
const CourseDetailsCard = ({
  course,
  setConfirmationModal,
  handleBuyCourse,
}) => {
  const { user } = useSelector((state) => state.auth);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function handleAddToCart() {
    // if user is instrcutor then why should add to cart be visible to it
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an instructor you cant buy a course");
    }
    // if user is logged in
    if (token) {
      dispatch(addToCart(course));
      return;
    }
    // user is not logged in
    setConfirmationModal({
      text1: "You are not logged in",
      text2: "Please login to add to cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => {
        navigate("/login");
      },
      btn2Handler: () => {
        setConfirmationModal(null);
      },
    });
  }
  function handleShare() {
    copy(window.location.href);
    toast.success("Link copied to clipboard");
  }
  const { thumbnail: thumbnailImage, price: CurrentPrice } = course;
  return (
    <div
      className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}
    >
      <img
        src={thumbnailImage}
        alt="thumbnailImage"
        className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
      />
      <div className="text-2xl text-caribbeangreen-100 font-bold">
        Rs. {CurrentPrice}
      </div>
      <div className="flex flex-col gap-4">
        <button
          className="text-center text-[16px] px-7 py-3 rounded-md font-bold first-letter: bg-yellow-50 text-black hover:scale-95 transition-all duration-200"
          onClick={
            user && course?.studentsEnrolled?.includes(user?._id)
              ? () => navigate("/dashboard/enrolled-courses")
              : handleBuyCourse
          }
        >
          {user && course.studentsEnrolled.includes(user?._id)
            ? "Go to Course"
            : "Buy Now"}
        </button>
        {!course?.studentsEnrolled?.includes(user?._id) && (
          <button
            className="text-center text-[16px] px-7 py-3 rounded-md font-bold first-letter: bg-yellow-50 text-black hover:scale-95 transition-all duration-200"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        )}
      </div>
      <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
        30 Day Money-back guarantee
      </p>
      <p className={`my-2 text-xl font-semibold `}>This Course includes:</p>
      <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
        {course?.instructions?.map((item, index) => {
          <p key={index} className="flex gap-2">
            <span>{item}</span>
          </p>;
        })}
      </div>
      <div className="text-center">
        <button
          className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
          onClick={handleShare}
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default CourseDetailsCard;
