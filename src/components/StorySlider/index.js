import Slider from 'react-slick'
import {FaArrowAltCircleRight, FaArrowAltCircleLeft} from 'react-icons/fa'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import StoryItem from '../StoryItem'

const StorySlider = props => {
  const {storyList} = props
  const settings = {
    slidesToShow: 6,
    slidesToScroll: 4,
    dots: false,
    nextArrow: <FaArrowAltCircleRight color="black" />,
    prevArrow: <FaArrowAltCircleLeft color="#E5E5E5" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 680,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  }
  return (
    <>
      <Slider {...settings}>
        {storyList.map(eachItem => (
          <StoryItem storyDetail={eachItem} key={eachItem.userId} />
        ))}
      </Slider>
    </>
  )
}

export default StorySlider
