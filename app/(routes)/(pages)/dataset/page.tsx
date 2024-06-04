'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';

type Event = {
  id: number;
  name: string;
  description: string;
  image: string;
  collaborators: string;
};

const events: Event[] = [
  { id: 1, name: 'Mt Maunganui Trip', description: 'For this pop-up, most of our team had brought all of our gear from Auckland & Hamilton, the boys did a day trip down to set this up, and after; we ended up packing down, driving to waihi to do another show, and then drive back to auckland again! Was a long yet awesome experience.', image: '/(static)/dataset/images/tauranga.jpg', collaborators: 'Dataset Official Pop-up Event' },
  { id: 2, name: 'Winter Mansion Event', description: 'Jarno, Luke and myself liased with the owner of a nice propertly our west to run a small networking / promotional event. This was the first outdoor event that taught the team proper event planning, ticketing, crowd management, catering, workign with sponsors and more. ', image: '/(static)/dataset/images/erica.jpg', collaborators: 'Dataset & ShuffleFM Collaboration' },
  { id: 3, name: 'Alphine Festival 2023', description: 'This pop-up in Ohakune was a concept show to get our foot in the door with local businesses and brands (including Mt Ruapehu Ski Managers) to see if we could pull off a festival sized event up the mountain in the snow! This turned out well and we plan to do a much bigger event this year.', image: '/(static)/dataset/images/alphine_fest.jpg', collaborators: 'Turoa Ski Lifts, TCB, Ruapehu Breweries, Kings Bar & Eatery' },
  { id: 4, name: 'Studio Event', description: 'We setup a small event to test out a new DJ studio setup.', image: '(static)/dataset/images/alphine_fest.jpg', collaborators: 'Shaynes Home Studio' },
  { id: 5, name: 'Waihi Hilltop Event', description: 'Following the Tauranga trip same day; we decided to setup in a spot with some nice views for conent.', image: '(static)/dataset/images/alphine_fest.jpg', collaborators: 'Dataset Official Pop-up' },
];

const DatasetPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event>(events[0]);

  return (
    <main>
      {/* Section 1 */}
      <div className="relative w-full min-h-screen">
        <div className="z-50 flex w-full bg-right bg-cover aspect-video" style={{ backgroundImage: `url('/(static)/dataset/images/beach_party.jpg')` }}>
          <div className="z-50 w-[55vw] min-h-screen p-8 bg-gradient-to-bl from-bgLight to-bgCard">
            <div className="flex flex-col justify-between h-full gap-4 ">
              <div className="flex items-center gap-2">
                <img src='/(static)/dataset/logos/dataset.png' className="w-16 h-16"></img>
                <h1 className="font-extrabold">Dataset & <br/>Douglas Media <br/>Ltd</h1>
              </div>
              <div className="absolute left-0 w-full -translate-y-1/2 top-1/2">
                <svg viewBox="0 0 100 55" preserveAspectRatio="none">
                  <text x="2.5" y="30" textAnchor="left" fontSize="8.3" fill="none" strokeWidth="0.1" stroke="#fff" fontFamily="sans-serif">BROADCAST & MEDIA</text>
                </svg>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                  <li className="font-medium">Livestream events</li>
                  <li className="font-medium">Audio & lighting specialists</li>
                  <li className="font-medium">Event planning & management</li>
                  <li className="font-medium">Graphic design, animation & motion design</li>
                  <li className="font-medium">High-grade photography videography services</li>
                  <div className="flex justify-between gap-8 mt-8"><div className="w-full h-[5px] bg-bgLight"></div><div className="w-full h-[5px] bg-datasetSecondary"></div><div className="w-full h-[5px] bg-bgDark"></div></div>
              </div>
            </div>
          </div>
          <div className="min-h-screen p-8"></div>
          <div className="absolute left-0 w-full -translate-y-1/2 drop-shadow-sm top-1/2">
                <svg viewBox="0 0 100 55" preserveAspectRatio="none">
                  <text x="2.5" y="30" textAnchor="left" fontSize="8.3" fill="white" strokeWidth="0.1" stroke="#fff" fontFamily="sans-serif">BROADCAST & MEDIA</text>
                </svg>
              </div>
        </div>
      </div>
      <div className="z-50 h-2 shadow-md bg-gradient-to-l from-bgLight to-bgCard"></div>

      {/* Section 2: Our Work */}
      <div className="relative flex w-full min-h-screen">
        <div className="w-[55vw] min-h-screen p-8 bg-gradient-to-br from-bgDark to-bgCard overflow-hidden">
          <h1 className='text-5xl font-extrabold'>Our Work</h1>
          <ul className="flex flex-col gap-4 mt-8 text-lg">
            {events.map((event) => (
              <motion.li key={event.id} whileHover={{ color: 'var(--datasetPrimary)' }} whileTap={{ color: 'var(--datasetPrimary)', fontWeight: 'bold' }} onClick={() => setSelectedEvent(event)} className="cursor-pointer">
                {event.name}
              </motion.li>
            ))}
          </ul>
        </div>
        <AnimatePresence mode='wait'>
          <motion.div key={selectedEvent.id} className="z-50 w-[45vw] min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="z-50 flex w-full bg-right bg-cover bg-datasetPrimary aspect-video" style={{ backgroundImage: `url('${selectedEvent.image}')` }}></div>
            <div className="p-8">
              <h1 className='text-3xl font-bold'>{selectedEvent.name}</h1>
              <h2 className="text-xl opacity-75">{selectedEvent.collaborators}</h2>
              <p className="text-md">{selectedEvent.description}</p>
              <p className="absolute bottom-0 mb-8 opacity-50 text-md">Skills Used: event management, videography, photography, broadcast</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Combined Section: About Us, Services, Testimonials */}
      <div className="relative w-full min-h-screen p-8 bg-gradient-to-b from-bgCard to-bgLight">
        <h1 className="mb-8 text-5xl font-extrabold">About Us</h1>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex-1  w-[55vw] bg-bgDark p-4">
            <div className="flex gap-4 ">
          <div>
            <img src="/(static)/dataset/images/headshots/connor.png" alt="Our Team" className="w-full h-auto rounded-md" />
            <p className="mt-2 text-xl font-bold">Connor Berghoffer</p>
            <p>Production Lead</p>
            </div>
            <div>
            <img src="/(static)/dataset/images/headshots/luke.png" alt="Our Team" className="w-full h-auto rounded-md" />
            <p className="mt-2 text-xl font-bold">Luke McGregor</p>
            <p>Sound / Lighting Expert</p>
            </div>
            </div>
            <div className="mt-8 ">
              <h2 className="mb-4 text-3xl font-bold">Testimonials</h2>
              <div className='p-2 border-b-2 border-opacity-50 border-datasetPrimary'>
                <span className='mr-8 font-bold text-datasetPrimary'>Jordan-Dylan Douglas</span>
                <span>⭐️⭐️⭐️⭐️⭐️</span>
                <p className='mb-2 text-xs font-light'><strong className='font-bold'>Positive: </strong>Professionalism, Quality, Responsiveness, Value</p>
                <p>Wind him up and watch him work. I was fortunate enough to get some sneak peaks at Connor's next projects. Definitely tuning in for his impressive camerawork and editing. I can't wait to see the finish products. The guy is a machine, he never stops going until he's satisfied and not just the client but the viewer as well are mind-blown.</p>
              </div>
              <div className='p-2 border-b-2 border-opacity-50 border-datasetPrimary'>
                <span className='mr-8 font-bold text-datasetPrimary'>Ryan Donaldson</span>
                <span>⭐️⭐️⭐️⭐️⭐️</span>
                <p className='mb-2 text-xs font-light'><strong className='font-bold'>Positive </strong></p>
                <p>Top quality work. Great photos and video for one of our car meets. Highly recommended Thanks from the kustom street scene crew.</p>
              </div>
              <div className='p-2 border-b-2 border-opacity-50 border-datasetPrimary'>
                <span className='mr-8 font-bold text-datasetPrimary'>Jonson</span>
                <span>⭐️⭐️⭐️⭐️⭐️</span>
                <p className='mb-2 text-xs font-light'><strong className='font-bold'>Positive: </strong>Professionalism, Quality, Responsiveness, Value</p>
                <p>Couldn’t ask for a better media company</p>
              </div>
              <div className='p-2 border-b-2 border-opacity-50 border-datasetPrimary'>
                <span className='mr-8 font-bold text-datasetPrimary'>thomas heavey</span>
                <span>⭐️⭐️⭐️⭐️⭐️</span>
                <p className='mb-2 text-xs font-light'><strong className='font-bold'>Positive</strong></p>
                <p></p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <p>Our team at <strong className="text-datasetPrimary">Dataset & Douglas Media</strong> aim to help events and businesses in the music industry grow by creating media that help promote their brand to gain an online identity or audience.<br/> <strong className="text-primary">We think we stand out</strong> because we spend more time on the little details. We also have had good experience understanding what our clients want and providing services that fit their needs. Our main goal at the moment is to grow and get our name out there, and we would like to take you along for the ride!</p>
            <ul className="mt-4 list-disc list-inside">
              <li>Livestream events</li>
              <li>Audio & lighting specialists</li>
              <li>Event planning & management</li>
              <li>Graphic design, animation & motion design</li>
              <li>High-grade photography & videography services</li>
            </ul>
            
          </div>
        </div>
      </div>

      {/* Section 5: Contact Us */}
      <div className="relative w-full p-8 bg-gradient-to-b from-bgCard to-bgLight">
        <h1 className="mb-8 text-5xl font-extrabold">Contact Us</h1>
        <p>If you have any questions or would like to collaborate with us, feel free to reach out!</p>
        <p><strong>Email:</strong> connor@futureco.co</p>
        <p><strong>Phone: +64 21 113 8564</strong></p>
        <p><strong>Based in Auckland, willing to travel.</strong></p>
      </div>
    </main>
  );
};

export default DatasetPage;
