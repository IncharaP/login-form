import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Import useUser hook
import styles from './UserWelcome.module.css';
import firstBannerVideo from '../assets/banner1.mp4';
import secondBannerVideo from '../assets/banner2.mp4';
import thirdBannerVideo from '../assets/banner3.mp4';
import fourthBannerVideo from '../assets/banner4.mp4';
import slideshowImage1 from '../assets/slideshowImage1.jpg'; 
import slideshowImage2 from '../assets/slideshowImage2.jpg';
import slideshowImage3 from '../assets/slideshowImage3.jpg';
import slideshowImage4 from '../assets/slideshowImage4.jpg';
import slideshowImage5 from '../assets/slideshowImage5.jpg';
import slideshowImage6 from '../assets/slideshowImage6.jpg';
import slideshowImage7 from '../assets/slideshowImage7.jpg';
import slideshowImage8 from '../assets/slideshowImage8.jpg';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';
import image4 from '../assets/image4.jpg';
import image5 from '../assets/image5.jpg';
import image6 from '../assets/image6.jpg';
import image7 from '../assets/image7.jpg';
import image8 from '../assets/image8.jpg';
import Modal from './Modal'; // Import the Modal component

const UserWelcome = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser(); // Get currentUser from context

  const [videoStates, setVideoStates] = useState({
    first: false,
    second: false,
    third: false,
    fourth: false
  });

  const [selectedImage, setSelectedImage] = useState(null); // State for selected image
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // State for slideshow index

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentSession');
    navigate('/');
  };

  const handleVideoClick = (videoKey) => {
    setVideoStates((prevState) => ({
      ...prevState,
      [videoKey]: !prevState[videoKey]
    }));
  };

  const handleImageClick = (image) => {
    setSelectedImage(image); // Set selected image
  };

  const closeModal = () => {
    setSelectedImage(null); // Clear selected image
  };

  // Featured images for the image gallery
  const imageDetails = [
    { id: 1, src: image1, name: 'Trays', price: '2500', description: 'Description for image 1' },
    { id: 2, src: image2, name: 'Cake Stand', price: '3500', description: 'Description for image 2' },
    { id: 3, src: image3, name: 'Chains', price: '1999', description: 'Description for image 3' },
    { id: 4, src: image4, name: 'Clock', price: '4000', description: 'Description for image 4' },
    { id: 5, src: image5, name: 'Table', price: '8000', description: 'Description for image 5' },
    { id: 6, src: image6, name: 'Pooja Plate', price: '3500', description: 'Description for image 6' },
    { id: 7, src: image7, name: 'Trays', price: '3200', description: 'Description for image 7' },
    { id: 8, src: image8, name: 'Trays', price: '2100', description: 'Description for image 8' }
    // Add more image details as needed
  ];

  // Slideshow images
  const slideshowImages = [
    { id: 1, src: slideshowImage1, name: 'Slideshow Image 1' },
    { id: 2, src: slideshowImage2, name: 'Slideshow Image 2' },
    { id: 3, src: slideshowImage3, name: 'Slideshow Image 3' },
    { id: 4, src: slideshowImage4, name: 'Slideshow Image 4' },
    { id: 5, src: slideshowImage5, name: 'Slideshow Image 5' },
    { id: 6, src: slideshowImage6, name: 'Slideshow Image 6' },
    { id: 7, src: slideshowImage7, name: 'Slideshow Image 7' },
    { id: 8, src: slideshowImage8, name: 'Slideshow Image 8' }
    // Add more slideshow images as needed
  ];

  // Slide timing in milliseconds
  const slideInterval = 3000; // 3 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
    }, slideInterval);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [slideshowImages.length]);

  return (
    <div className={styles.userWelcomeContainer}>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <ul className={styles.navLinks}>
            <li><Link to="/user-welcome" className={styles.navLink}>Home</Link></li>
            <li><Link to="/view-items" className={styles.navLink}>View Items</Link></li>
            <li><Link to="/cart" className={styles.navLink}>Cart</Link></li>
            <li><Link to="/user-orders" className={styles.navLink}>My Orders</Link></li>

            <li><button className={styles.logoutButton} onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>
      </header>

      <div className={styles.content}>
        {/* Welcome Message */}
        <div className={styles.welcomeMessageContainer}>
          <h1 className={styles.welcomeMessage}>
            Welcome, {currentUser ? currentUser.username : 'User'}!
          </h1>
        </div>

        <div className="parentContainer">
  <div className={styles.resinInfoContainer}>
    <section className={styles.slideshow}>
      <div className={styles.slideWrapper}>
        <img
          src={slideshowImages[currentSlideIndex].src}
          alt={slideshowImages[currentSlideIndex].name}
          className={styles.slideshowImage}
        />
      </div>
    </section>
    <div className={styles.resinInfoText}>
      <h2 className={styles.resinInfoTitle}>About Our Resin</h2>
      <p>
        Welcome to our resin web page! Our resin products are crafted with precision and care to ensure the highest quality. Whether you’re an artist, a hobbyist, or a professional, our resins offer the perfect solution for your projects.
      </p>
     
        <div className={styles.resinInfoList}>
        <p style={{
  color: '#007BFF', /* Text color */
  fontStyle: 'italic', /* Italic text */
  fontWeight: 'bold' ,
  fontSize: '16px'/* Bold text */
}}>
  Our resin features include:
</p>
          <p>High clarity and glossy finish</p>
          <p>Fast curing times</p>
          <p>Easy to use and mix</p>
          <p>Durable and long-lasting</p>
          <p>Available in various colors and formulations</p>
          
        </div>
 
      <p>
        Explore our range of resin products and discover how they can enhance your creative projects. From casting and molding to coating and finishing, our resins provide the perfect blend of quality and performance.
      </p>
    </div>
  </div>
</div>


        {/* Image Gallery */}
        <section className={styles.imageGallery}>
          <h2>Featured Images</h2>
          <div className={styles.imageGrid}>
            {imageDetails.map((image) => (
              <div
                key={image.id}
                className={`${styles.imageItem} ${styles[`image${image.id}`]}`}
                onClick={() => handleImageClick(image)}
              >
                <div className={styles.imageOverlay}>
                  <p>Click to view details</p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* Banner Section */}
        <div className={styles.banner}>
          <h2>Some Resin Making Videos</h2>
          <section className={styles.bannerSection}>
            {Object.keys(videoStates).map((videoKey, index) => (
              <div key={index} className={styles.bannerVideoWrapper} onClick={() => handleVideoClick(videoKey)}>
                <video
                  className={styles.bannerVideoContent}
                  controls
                  playsInline
                  muted
                  src={
                    videoKey === 'first' ? firstBannerVideo :
                    videoKey === 'second' ? secondBannerVideo :
                    videoKey === 'third' ? thirdBannerVideo :
                    fourthBannerVideo
                  }
                  autoPlay={videoStates[videoKey]}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </section>
        </div>
      </div>

      {selectedImage && (
        <Modal onClose={closeModal}>
          <div className={styles.modalContent}>
            <img src={selectedImage.src} alt={selectedImage.name} className={styles.modalImage} />
            <div className={styles.modalDetails}>
              <h2>{selectedImage.name}</h2>
              <p><strong>Price:</strong> ₹{selectedImage.price}</p>
              <p><strong>Description:</strong> {selectedImage.description}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserWelcome;
