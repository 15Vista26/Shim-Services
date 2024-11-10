import React, { useRef, useEffect } from 'react';

import Details from './Details';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Reviews } from './Reviews';


const Card = ({ imageSrc, title }) => (
  <div className="m-4 p-1 text-center w-30 h-32 text-gray-900 transition-shadow duration-300 overflow-visible hover:shadow-lg">
    <img src={imageSrc} alt="card" className="w-full h-full object-cover" />
    <p className="mt-1">{title}</p>
  </div>
);

const PestControl = () => {

  
  const handleBookNow = () => {
    
      
      navigate('/booking');
  
  };
  const services = [
    {
      id: 1,
      imgSrc: 'https://media.istockphoto.com/id/1353114711/photo/close-up-image-of-unrecognisable-person-doing-a-maintenance-service-on-a-household-filtration.jpg?s=612x612&w=0&k=20&c=NIMYCik-K0SUHDoI3FVD_9x9qcsBGyXf0kkfzHBbg-g=',
      title: 'Appliance  Compressor Repair',
      description: [
        'Thorough servicing of appliance compressors',
        'Filter replacement and comprehensive cleaning'
      ],
      // price: 120
    },
    {
      id: 2,
      imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThf6ou9ZEt19JPPZtaTeI2bcjfaHRMczbFEbVEjPem8Qwkos-0Pe9RFjRePotO5_uCvJk&usqp=CAU',
      title: 'Appliance  Filter Replacement',
      description: [
        'Advanced filter replacement technology',
        'Deep cleaning of air filters'
      ],
      // price: 80
    },
    {
      id: 3,
      imgSrc: 'https://tse4.mm.bing.net/th?id=OIP.A_j-Llwh9Y2sSRsuX3GoqQHaDu&pid=Api&P=0&h=180',
      title: 'Appliance Gas Refill',
      description: [
        'Complete gas refill for refrigerators',
        'Includes inspection and repair of leaks'
      ],
      // price: 100
    },
    {
      id: 4,
      imgSrc: 'https://tse4.mm.bing.net/th?id=OIP.vm36fnWRKXKChjahir4uEwHaE8&pid=Api&P=0&h=180',
      title: 'Appliance Installation',
      description: [
        'Expert installation of new appliances',
        'Full diagnostic and testing post-installation'
      ],
      // price: 120
    },
    {
      id: 5,
      imgSrc: 'https://media.istockphoto.com/id/1347513910/photo/microwave-control.jpg?s=612x612&w=0&k=20&c=kTHeSYMCHxPSHTqoy2U_RjqnA01tvaQvqymofctrITI=',
      title: 'Appliance Servicing',
      description: [
        'Comprehensive servicing for appliances',
        'Includes repairs and safety checks'
      ],
      // price: 80
    },
    {
      id: 6,
      imgSrc: 'https://tse1.mm.bing.net/th?id=OIP.MOl_Fp2e77BMIhd8KwNw3QHaEI&pid=Api&P=0&h=180',
      title: 'Duct Cleaning',
      description: [
        'Thorough cleaning of HVAC ducts',
        'Includes inspection and removal of debris'
      ],
      // price: 80
    },
    {
      id: 7,
      imgSrc: 'https://media.istockphoto.com/id/1410734240/photo/electrician-installing-an-oven-at-a-house.jpg?s=612x612&w=0&k=20&c=o9AL96Rg__M4QPnunpKh2ECo3dnGQr8oBRuTgIrJVG0=',
      title: 'Evaporator Coil Cleaning',
      description: [
        'Detailed cleaning of evaporator coils',
        'Includes inspection and maintenance of the coil'
      ],
      // price: 85
    },
    {
      id: 8,
      imgSrc: 'https://media.istockphoto.com/id/542214568/photo/he-knows-those-pipes-like-the-back-of-his-hands.jpg?s=612x612&w=0&k=20&c=O62eQCe5qKBpiffhcn53lUdNSmCA-PtNDhgbugtjN8k=',
      title: 'Thermostat Replacement',
      description: [
        'Replacement of faulty thermostats',
        'Includes calibration and testing'
      ],
      // price: 70
    }
  ];

  const cardItems = [
    { id: 1, imageSrc: 'https://media.istockphoto.com/id/1308686330/photo/technician-examining-dishwasher.jpg?s=612x612&w=0&k=20&c=dOnBvAdU8y_OlEjDbN_DxAUkSVUxXwg4OSIra5yX93o=', title: 'Appliance Installation' },
    { id: 2, imageSrc: 'https://media.istockphoto.com/id/614135768/photo/repairman-is-repairing-a-washing-machine-on-the-white-background.jpg?s=612x612&w=0&k=20&c=nKCPfBCkfKEBBKWwK4muG8wdhyJoBRIHlLH6JZEBG6k=', title: 'Appliance Servicing' },
    { id: 3, imageSrc: 'https://media.istockphoto.com/id/1180607321/photo/two-young-male-movers-placing-steel-refrigerator-in-kitchen.jpg?s=612x612&w=0&k=20&c=PW4dVclZ9wCgc-qq6BLHuMKzzStEW2N4-DxmlUk0K54=', title: 'Appliance Gas Refill' },
    { id: 4, imageSrc: 'https://media.istockphoto.com/id/512511894/photo/repairman-is-repairing-a-washing-machine-entering-malfunction.jpg?s=1024x1024&w=is&k=20&c=iSUTD2qjWJP7uuhTGh5yLccPWy9oqvkJ7QZaWmzXCKg=', title: 'Appliance Duct Cleaning' },
    { id: 5, imageSrc: 'https://media.istockphoto.com/id/912624814/photo/young-repairman-in-protective-workwear-fixing-oven-in-kitchen.jpg?s=1024x1024&w=is&k=20&c=pIc7EIHJxrkdYsDfKbcfwis6lyOYbx8kw7pxRCEEPgQ=', title: 'Thermostat Replacement' },
    { id: 6, imageSrc: 'https://cdn.pixabay.com/photo/2020/12/28/09/44/man-5866475_1280.jpg', title: 'Appliance Filter Replacement' },
  ];

  const leftSectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const stickyOffset = leftSectionRef.current.offsetTop;
      if (window.scrollY > stickyOffset) {
        leftSectionRef.current.classList.add("sticky");
      } else {
        leftSectionRef.current.classList.remove("sticky");
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col-reverse justify-between gap-2.5 md:flex-row">
        {/* Left Section */}
        <div className="md:w-1/2 text-black flex flex-wrap p-2.5 sticky top-0 max-h-[calc(100vh-40px)] overflow-y-auto" ref={leftSectionRef}>
          <div className="mb-2.5 mt-2.5 pl-4">
            <h2 className="text-5xl font-extrabold text-center mb-4">Appliances Repair</h2>
            <p className="mt-2">Don't let appliance issues slow you down. ShimServices is here to help. When appliances break, ShimServices fixes them fast.</p>
            <div className="flex items-center underline">
              <img src="https://t3.ftcdn.net/jpg/04/20/03/48/360_F_420034841_AKpgqQGkkUyeD7oWc9y8vGTMwT4GmbHm.jpg" className="h-5 w-20 mt-2" alt="rating" />
              <p className="ml-2">6M+ bookings till now</p>
            </div>
            <button onClick={handleBookNow} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Book Now</button>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {cardItems.map(item => (
              <Card key={item.id} imageSrc={item.imageSrc} title={item.title} />
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="mx-4 md:w-1/2 mt-24 pl-5 box-border z-[-1]">
          <Carousel fade>
            <Carousel.Item>
              <video className="w-full h-[400px] object-cover" src="https://videos.pexels.com/video-files/6790697/6790697-sd_360_640_25fps.mp4" autoPlay muted loop playsInline></video>
              <Carousel.Caption>
              <div className="bg-white/30 backdrop-blur-sm p-4 rounded-md">
      <h2 className="text-2xl font-bold text-white">
        Where Appliances meet Expertise!
      </h2>
    </div>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img className="w-full h-[400px] object-cover" src="https://media.istockphoto.com/id/1469519318/photo/home-appliances-household-kitchen-technics-in-appartments.jpg?s=612x612&w=0&k=20&c=7G4E68TtgAoKInU1jFtZ3JGkbAEtxCZVuMIJ2SWNSTg=" alt="carousel item" />
              <Carousel.Caption>

               <div className="bg-white/30 backdrop-blur-sm p-4 rounded-md">
      <h2 className="text-2xl font-bold text-white">
        Appliance Rescue, Done Right</h2>
        </div>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img className="w-full h-[400px] object-cover" src="https://media.istockphoto.com/id/1347516184/photo/repairman-handshake-in-house-door.jpg?s=612x612&w=0&k=20&c=ePJmBK67AQ1O__VvHkMFKp7UE4rwHbSNhUTNqQ9M2j0=" alt="carousel item" />
              <Carousel.Caption>
              <div className="bg-white/30 backdrop-blur-sm p-4 rounded-md">
              <h2 className="text-2xl font-bold text-white">All things done Right. At your pace, At your comfort.</h2>
              </div>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
      </div>

      {/* Additional Section */}
      <div className="flex flex-col-reverse md:flex-row p-2.5 m-6">
        <div className="flex flex-col text-xl md:w-1/2">
          <hr />
          <h2 className='font-bold text-center mt-4'>What we offer</h2>
          <p>ShimServices provides reliable repair services for home appliances:</p>
          <ul className="list-disc list-inside mt-4">
            <li><strong>AC Repair & Service</strong></li>
            <li><strong>Refrigerator Repair</strong></li>
            <li><strong>Washing Machine Repair</strong></li>
            <li><strong>Microwave Repair</strong></li>
            <li><strong>Television Repair</strong></li>
            <li><strong>Geyser Repair</strong></li>
          </ul>
          <Reviews />
        </div>
        <div className="flex-6">
          <Details services={services} service_name={"Appliance Repair"} />
        </div>
      </div>
      
    </>
  );
};

export default PestControl;
