import * as React from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSpring, animated } from "@react-spring/web";
import { Divider, IconButton, Stack, TextField } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import UploadWidget from "./DropZone";
import { useMediaQuery } from "@mui/material";
import MyButtons from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import MultiLineTextField from "./MultilineTextField";
import MultiDropZone from "./MultiDropZone";
import Cloudinary from "./Cloudinary";
import BootLoader from "./BootLoader";
import PostCaller from "../Hooks/PostCaller";
import PutCaller from "../Hooks/PutCaller";
import Picker from "../Components/Picker";
import { setMessage, setSnackBarOpen } from "../Redux/reducer";
import UploadWidgetVideo from "./VDdropZone";
import VCloudinary from "./Vcloudinary";

const Fade = React.forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        // onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};

const EditConsole = ({ onClick, category, open, name, setOpen }) => {
  const categoryName = useSelector((state) => state.user.productid);
  const dispatch = useDispatch();
  const isNonMobileScreen = useMediaQuery("(min-width: 600px)");
  const [image, setImage] = useState();
  const [recipe, setRecipee] = useState("");
  const [images, setImages] = useState([]);
  const [images2, setImages2] = useState([]);
  const [images3, setImages3] = useState([]);
  const [descriptions, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [preparations, setPreparations] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [categoryalt, setCategory] = React.useState("Recipee");
  const [video, setVideo] = useState(); //NEW
  // console.log(video);
  const handleChange = (event) => {
    setCategory(event.target.value);
  };
  // console.log(`categoryalt==>`, categoryalt, `category==>`, category);
  // console.log(`categoryName==>`, categoryName, `name`, name);
  const useSubmit = async () => {
    try {
      const covervideo = await VCloudinary(video, setIsUploading); //NEW
      const cover = await Cloudinary(image, setIsUploading);
      const descriptionimage = await Cloudinary(images, setIsUploading);
      const ingredientsimage = await Cloudinary(images2, setIsUploading);
      const preparationsimage = await Cloudinary(images3, setIsUploading);

      const payLoad = {
        category: category ? category : categoryalt,
        title: recipe,
        cover: cover,
        covervideo: covervideo, //NEW
        descriptions: {
          descriptions: descriptions,
          descriptionimage: descriptionimage,
        },
        ingredients: {
          ingredients: ingredients,
          ingredientsimage: ingredientsimage,
        },
        preparations: {
          preparations: preparations,
          preparationsimage: preparationsimage,
        },
        name: name ? name : categoryName,
      };
      // console.log(payLoad);
      const createCategory =
        category === "Recipee"
          ? PostCaller(
              {
                name: name ? name : categoryName,
              },
              "createcollection",
              {
                "Content-Type": "application/json",
              }
            )
          : null;
      const createdCategory = await createCategory;
      console.log(createdCategory);
      dispatch(setSnackBarOpen(true));
      dispatch(setMessage(createdCategory ? createdCategory.message : null));

      console.log(createdCategory);

      const updatedCategory =
        categoryalt === "Recipee" &&
        (category === "Recipee" || category === undefined)
          ? PutCaller(payLoad, "updatecollection", {
              "Content-Type": "application/json",
            })
          : PostCaller(payLoad, "upload", {
              "Content-Type": "application/json",
            });
      const updatedCategoryResult = await updatedCategory;
      console.log(updatedCategoryResult);
      dispatch(setSnackBarOpen(true));
      dispatch(setMessage(updatedCategoryResult.message));
      onClick();
    } catch (err) {
      console.error(err);
    }
  };

  const style = {
    transform: isNonMobileScreen ? "translate(10%, 20%)" : "translate(3%, 3%)",
    width: isNonMobileScreen ? "80%" : "100%",
    maxHeight: isNonMobileScreen ? 500 : "auto",
    bgcolor: "background.paper",
    opacity: 1.0,
    border: "2px solid #000",
    boxShadow: 24,
    borderRadius: 8,
    p: 4,
    overflow: isNonMobileScreen ? "scroll" : "scroll",
    "&::-webkit-scrollbar": {
      width: "0.1rem",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "transparent",
    },
  };

  return (
    <div>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        // onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade
          in={open}
          sx={{
            borderRadius: 10,
          }}
        >
          <Stack spacing={2} sx={style} justifyContent="space-between">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                paddingLeft: 1,
                paddingRight: 1,
              }}
            >
              <Stack
                direction="row"
                sx={{
                  width: "auto",
                }}
              >
                <Typography
                  sx={{
                    color: "blueviolet",
                    fontWeight: "bold",
                    size: 40,
                  }}
                >
                  Add a{" "}
                  {category ? (
                    category
                  ) : (
                    <Picker age={categoryalt} handleChange={handleChange} />
                  )}
                </Typography>
              </Stack>

              <Typography
                sx={{
                  color: "blueviolet",
                  fontWeight: "bold",
                  size: 40,
                }}
              >
                Name of Category: {name ? name : categoryName}
              </Typography>
              <MyButtons
                text="Back"
                startIcon={<ArrowBackIosIcon />}
                onClick={onClick}
              />
            </Stack>
            <Typography
              sx={{
                color: "blueviolet",
                fontWeight: "bold",
                size: 35,
              }}
            >
              {/* {foundjob.name} */}
            </Typography>
            <Stack direction="row" width="100%">
              <UploadWidget
                image={image}
                setImage={setImage}
                label="Upload a cover image"
              />
              <UploadWidgetVideo //NEW
                file={video}
                setFile={setVideo}
                label="Upload a video"
              />
            </Stack>
            <Stack
              spacing={3}
              justifyContent="space-between"
              sx={{
                width: "100%",
              }}
            >
              <TextField
                label={`name of ${category}`}
                onChange={(e) => setRecipee(e.target.value)}
              />
              {category === "online course" ||
              category === "rome course" ||
              category === "product" ? null : (
                <MultiDropZone images={images} setImages={setImages} />
              )}
              <MultiLineTextField
                label="Description"
                onChange={(e) => setDescription(e.target.value)}
              />
              {category === "online course" ||
              category === "rome course" ||
              category === "product" ? null : (
                <>
                  <MultiDropZone images={images2} setImages={setImages2} />
                  <MultiLineTextField
                    label="Ingredients"
                    onChange={(e) => setIngredients(e.target.value)}
                  />
                  <MultiDropZone images={images3} setImages={setImages3} />
                  <MultiLineTextField
                    label="Preparations"
                    onChange={(e) => setPreparations(e.target.value)}
                  />
                </>
              )}
            </Stack>
            <BootLoader open={isUploading} />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <MyButtons
                text="Proceed"
                startIcon={<ArrowBackIosIcon />}
                onClick={useSubmit}
              />
              <MyButtons
                text="Cancel"
                startIcon={<ArrowBackIosIcon />}
                onClick={onClick}
              />
            </Stack>
            <BootLoader open={isUploading} />
          </Stack>
        </Fade>
      </Modal>
    </div>
  );
};

export default EditConsole;
