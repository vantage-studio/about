import { useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

function App() {
  // Refs for scroll and video functionality
  const contentLeftRef = useRef(null);
  const mainLeftRef = useRef(null);
  const wrapperLeftRef = useRef(null);
  const videoRef = useRef(null);
  const mainRightRef = useRef(null);
  // GSAP scroll animation setup
  useGSAP(
    () => {
      const content = contentLeftRef.current;
      const mainLeft = mainLeftRef.current;
      const wrapper = wrapperLeftRef.current;

      // Set wrapper height based on content
      wrapper.style.height = content.getBoundingClientRect().height + "px";

      ScrollTrigger.create({
        trigger: mainLeft,
        scroller: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: {
          ease: "power2.out",
          duration: 1.5,
        },
        onUpdate: (self) => {
          const contentHeight = content.getBoundingClientRect().height;
          const viewportHeight = mainLeft.getBoundingClientRect().height;
          const maxScroll = contentHeight - viewportHeight;

          gsap.to(content, {
            y: -(self.progress * maxScroll),
            duration: 0.5,
            ease: "power2.out",
          });
        },
        invalidateOnRefresh: true,
      });

      // Update wrapper height on window resize
      window.addEventListener("resize", () => {
        wrapper.style.height = content.getBoundingClientRect().height + "px";
      });

      return () => {
        window.removeEventListener("resize", () => {});
      };
    },
    { scope: mainLeftRef }
  );

  // Video click handler for fullscreen
  const handleVideoClick = () => {
    const iframe = videoRef.current;
    iframe.contentWindow.postMessage(
      JSON.stringify({
        method: "play",
        value: 1,
      }),
      "*"
    );

    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
      iframe.webkitRequestFullscreen();
    } else if (iframe.mozRequestFullScreen) {
      iframe.mozRequestFullScreen();
    }
  };

  return (
    <div className="main">
      {/* Main Content Container */}
      <div ref={mainLeftRef} className="main-left">
        {/* Navigation Bar */}
        <div className="nav-wrapper">
          <div className="nav-buttons-group">
            <a className="nav-button nav-link" href="/sustainability">
              Sustainability
            </a>
            <button aria-label="Contact us" className="nav-button">
              Contact us
            </button>
            <button aria-label="Join the team" className="nav-button">
              Join the team
            </button>
          </div>
        </div>

        {/* Scroll Content Wrapper */}
        <div ref={wrapperLeftRef} className="scroll-wrapper-left">
          <div ref={contentLeftRef} className="main-left-content">
            {/* Hero Section */}
            <div className="left-content-msg-one">
              We give meaning to space through profound form and function.
            </div>

            {/* Main Description */}
            <div className="left-content-description">
              <div className="left-link-container">
                <div className="left-fade-section left-link-container left-visible">
                  <p>
                    We are Powerhouse Company, an international architectural
                    firm rooted in the heart of Rotterdam, the Netherlands, with
                    offices in Oslo and Munich. Since our establishment in 2005,
                    we've grown into a vibrant, multidisciplinary team of over
                    100 talented professionals.
                  </p>
                  <p>
                    Founder Nanne de Ru is joined by an esteemed leadership
                    team, including Paul Stavert, Stefan Prins, Sander Apperlo,
                    Johanne Borthne, Albert Takashi Richters and Emma Scholten.
                    Together, we are forging ahead into the future of
                    architecture, driven by a shared passion for innovation and
                    design excellence.
                  </p>
                  <p>
                    Our portfolio consists of a diverse range of projects that
                    reflect our dedication to timelessness, beauty, and the
                    quality of life for the users of these projects. Our work
                    includes{" "}
                    <strong>
                      <a href="https://www.powerhouse-company.com/bunker-tower/article/reviving-a-brutalist-beast">
                        transformation projects
                      </a>
                    </strong>
                    ,{" "}
                    <strong>
                      <a href="https://www.powerhouse-company.com/cases/villas">
                        villas
                      </a>
                    </strong>
                    ,{" "}
                    <a href="https://www.powerhouse-company.com/cases/offices">
                      <strong>future-proof workspaces</strong>
                    </a>
                    ,{" "}
                    <a href="https://www.powerhouse-company.com/cases/living">
                      <strong>residential complexes</strong>
                    </a>
                    ,{" "}
                    <strong>
                      <a href="https://www.powerhouse-company.com/cases/interiors">
                        custom interior designs
                      </a>
                    </strong>
                    , and impactful{" "}
                    <a href="https://www.powerhouse-company.com/cases/public-spaces">
                      <strong>public projects</strong>
                    </a>
                    . From awe-inspiring residences that seamlessly blend with
                    nature to sustainable mixed-use developments that redefine{" "}
                    <strong>
                      <a href="https://www.powerhouse-company.com/cases/towers">
                        cityscapes
                      </a>
                    </strong>
                    , we leave our mark by carefully shaping our projects into
                    well-balanced designs through in-depth research into the
                    historical and future context.
                  </p>
                </div>
              </div>
            </div>

            {/* Video Section */}
            <div className="video-container">
              <div className="video-wrapper aspect-video">
                <div className="video-frame">
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <iframe
                      ref={videoRef}
                      src="https://player.vimeo.com/video/799141689?title=0&byline=0&portrait=0&autopause=0&app_id=122963&background=1&player_id=video1"
                      width="426"
                      height="240"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                      title="About Powerhouse Company.mp4"
                      style={{ width: "100%", height: "100%" }}
                    ></iframe>
                  </div>
                </div>
                <div
                  className="video-overlay clickable"
                  onClick={handleVideoClick}
                ></div>
                <div className="video-filter"></div>
                <button className="play-button" onClick={handleVideoClick}>
                  <div className="play-icon"></div>
                </button>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="left-content-msg-two">
              Our mission is to create meaningful spaces that enhance people's
              lives.
            </div>

            {/* Secondary Description */}
            <div className="left-content-description left-content-description-inherit">
              <div className="left-link-container">
                <div className="left-fade-section left-link-container left-visible">
                  <p>
                    Behind every iconic project is a talented team of
                    international architects, designers, and thinkers. At
                    Powerhouse Company, our multidisciplinary team is our
                    enriching asset. Together we ensure that each creation
                    stands as a testament to the full ownership we take of every
                    project, from concept to construction supervision. Our
                    approach to design is based on how we intertwine context,
                    aesthetics, and function. The outcome is the human and
                    serene clarity that people sense in all our projects.
                  </p>
                  <p>
                    At Powerhouse Company, we believe that the true essence of a
                    project emerges through a collaborative journey with our
                    clients. By actively engaging with them, understanding their
                    social, economic, and
                    <strong>
                      <a href="/sustainability">sustainability</a>
                    </strong>
                    goals, we coalesce their vision with our
                    <a href="/sustainability">
                      <strong>expertise</strong>
                    </a>
                    . Our collaborative spirit extends beyond our own walls; we
                    embrace the opportunity to co-create with other design
                    practices, fostering a vibrant ecosystem of creativity. We
                    actively engage by working hand in hand with fellow
                    architects and designers in workshops and meaningful
                    partnerships. We don't merely build structures; we craft
                    narratives, weaving together the aspirations of our clients
                    with our passion for timeless, elegant, and purposeful
                    design. With our clients we seek to transform a vision into
                    reality to shape a future where architecture transcends the
                    ordinary, taking them on a journey where architecture
                    becomes a living testament to the delicate balance between
                    constraints and opportunities. Shaping a future that
                    transcends the ordinary.
                  </p>
                </div>
              </div>
            </div>

            {/* Company Statement */}
            <div className="left-content-msg-three">
              We are Powerhouse Company.
              <br /> We give meaning to space.
            </div>

            {/* Awards Section */}
            <div className="left-content-awards"></div>

            {/* Newsletter Section */}
            <div className="newsletter-container">
              <section className="newsletter-content">
                <div className="newsletter-heading">
                  <div>
                    Sign up for the
                    <br /> latest updates
                  </div>
                </div>
                <form className="newsletter-form">
                  <div className="newsletter-subheading">
                    Subscribe to our newsletter
                  </div>
                  <div className="input-container">
                    <div className="input-wrapper">
                      <input
                        type="email"
                        className="input-field"
                        id="subscribe-email"
                        placeholder=" "
                        required
                      />
                      <label htmlFor="subscribe-email" className="input-label">
                        Email address
                      </label>
                    </div>
                  </div>
                  <button className="subscribe-button">Subscribe</button>
                </form>
              </section>
            </div>

            {/* Featured Work Section */}
            <div className="featured-work">
              <div className="featured-work__heading">Featured work</div>
              <div className="featured-work__grid">
                {/* Project Card 1 */}
                <div className="project-card">
                  <div className="project-card__image-wrapper project-card__image--library"></div>
                  <div className="project-card__title">
                    Rotterdam Central Library
                  </div>
                </div>
                {/* Project Card 2 */}
                <div className="project-card">
                  <div className="project-card__image-wrapper project-card__image--hourglass"></div>
                  <div className="project-card__title">Hourglass</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ref={mainRightRef} className="main-right"></div>
    </div>
  );
}

export default App;
