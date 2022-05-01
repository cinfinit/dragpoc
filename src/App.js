import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

function DraggableHooks(props) {
  console.log("child positions", props.position);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(props.position);
  // putting dragging/position states into one ref

  const stateRef = useRef(null);
  const vidRef = useRef(null);
  const [videoState, setvideoState] = useState(false);
  // Update the ref's value whenever the position/isDragging
  // state changes.
  useEffect(() => {
    stateRef.current = { position, isDragging };
  }, [position, isDragging]);

  useEffect(() => {
    function handleMouseMove(event) {
      //  reading the dragging/position state from the
      // ref, which should always hold the latest state
      const { isDragging, position } = stateRef.current;
      console.log("isdragging", isDragging);
      if (isDragging) {
        let newX = 0;
        let newY = 0;

        //checking for the type of event being fired

        // mouseevents (happening over desktop or such devices)
        if (event.type == "mousemove") {
          newX = position[0] + event.movementX;
          newY = position[1] + event.movementY;
        }

        //touch events (mostly occuring in touch devices)
        if (event.type == "touchmove") {
          console.log("client x", event.touches);
          newX = Math.round(event.touches[0].clientX);
          newY = Math.round(event.touches[0].clientY);
        }

        //putting the video running state to false during dragging
        setvideoState(false);
        vidRef.current.pause();

        //setting up the positions states
        setPosition([newX, newY]);
        props.setnewposition([newX, newY]);
      }
    }

    //adding various events and their corresponding functions
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("touchend", handleMouseUp);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchleave", handleMouseUp);

    //so basically based on the movements (coordinates while dragging) , this function decides the quadrant
    //set the position of the video element
    //Note: to give a cleaner look gave a few bit of extra space , if not required we can remove that space
    function handleMouseUp() {
      let centerX = document.documentElement.clientWidth / 2;
      let centerY = document.documentElement.clientHeight / 2;

      //first quadrant
      const newPosition = stateRef.current.position;
      if (newPosition[0] < centerX && newPosition[1] < centerY) {
        console.log("first quadrant");
        setPosition([40, 40]);
        props.setnewposition([40, 40]);
      }

      //second quadrant
      if (newPosition[0] > centerX && newPosition[1] < centerY) {
        console.log("second quadrant");
        //240
        setPosition([document.documentElement.clientWidth - 240, 40]);
        props.setnewposition([document.documentElement.clientWidth - 240, 40]);
      }

      //third quadrant
      if (newPosition[0] < centerX && newPosition[1] > centerY) {
        console.log("third quadrant ");
        // 340
        setPosition([40, document.documentElement.clientHeight - 340]);
        props.setnewposition([40, document.documentElement.clientHeight - 340]);
      }

      //fourth quadrant
      if (newPosition[0] > centerX && newPosition[1] > centerY) {
        console.log("fourth quadrant");
        // 240 340
        setPosition([
          document.documentElement.clientWidth - 240,
          document.documentElement.clientHeight - 340,
        ]);
        props.setnewposition([
          document.documentElement.clientWidth - 240,
          document.documentElement.clientHeight - 340,
        ]);
      }
      setIsDragging(false);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchleave", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  //for toggling the play/pause of the video element
  const toggleVideoState = () => {
    console.log();
    if (videoState) {
      vidRef.current.pause();
      setvideoState(!videoState);
    } else {
      vidRef.current.play();
      setvideoState(!videoState);
    }
  };
  return (
    <div
      style={{
        border: "1px soild black",
        backgroundColor: "black",
        position: "absolute",
        left: props.position[0],
        top: props.position[1],
      }}
      onMouseDown={() => setIsDragging(true)}
      onTouchMove={() => setIsDragging(true)}
    >
      <video ref={vidRef} width="200" height="300" onClick={toggleVideoState}>
        <source src="samplevideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

function MainComponent() {
  const [position, setPosition] = useState([40, 40]);
  return (
    <div style={{ backgroundColor: "yellow", height: "100vh" }}>
      <DraggableHooks position={position} setnewposition={setPosition} />
    </div>
  );
}

export default MainComponent;
