import React from "react";
import "./style.css";
import Stories from "react-insta-stories";

function StoriesHome() {
  const stories: any = [
    {
      url: "https://picsum.photos/1080/1920",
      //   seeMore: <SeeMore />,
      header: {
        heading: "5 лучших вин для вашего вечера",
      },
    },
    {
      url: "https://picsum.photos/1080/1920",
      //   seeMore: <SeeMore />,
      header: {
        heading: "5 лучших вин для вашего вечера",
      },
    },
    {
      url: "https://picsum.photos/1080/1920",
      //   seeMore: <SeeMore />,
      header: {
        heading: "5 лучших вин для вашего вечера",
      },
    },
  ];

  return (
    <div className="stories__home">
      <div className="stories__home-card">
        <Stories
          loop
          keyboardNavigation
          defaultInterval={10000}
          stories={stories}
          onStoryEnd={(s: any, st: any) => console.log("story ended", s, st)}
          onAllStoriesEnd={(s: any, st: any) =>
            console.log("all stories ended", s, st)
          }
          onStoryStart={(s: any, st: any) =>
            console.log("story started", s, st)
          }
        />
        {/* <ReactInstaStories
          stories={stories}
          defaultInterval={1500}
          width={432}
          height={768}
        /> */}
      </div>
    </div>
  );
}

export default StoriesHome;
