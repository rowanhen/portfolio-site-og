import SmoothScroll from './smoothscroll/SmoothScroll'
import Section from './section/Section'
import '../styles/pagecontent.css';

export const PageContent = () => {
    return (
      <SmoothScroll>
        <Section flexDirection="row">
          <div className="page_01_wrapper">
            <div className="page_01_sectioning">01</div>
            <div className="page_01_title">Rowan Henseleit</div>
            <div className="page_01_detail">Junior Software Engineer & Creative Coder</div>
          </div>
        </Section>
        <Section flexDirection="row-reverse">
          <div className="page_01_wrapper">
            <div className="page_01_sectioning">02</div>
            <div className="page_01_title">Skills</div>
            <div className="page_01_detail">Competent React & JS Developer specialising in Front-End Development</div>
          </div>
        </Section>
        <Section flexDirection="row">
          <div className="page_01_wrapper">
            <div className="page_01_sectioning">03</div>
            <div className="page_01_title">Projects</div>
            <div className="page_01_detail">
              <div><a className="href_links" href="https://warmm.co.uk">https://warmm.co.uk</a></div>
              <div><a className="href_links" href="https://vitalstudios.co">https://vitalstudios.co</a></div>
              <div><a className="href_links" href="https://prototype26.netlify.app">https://prototype26.netlify.app</a></div>
            </div>
          </div>
        </Section>
        <Section flexDirection="row-reverse">
          <div className="page_01_wrapper">
            <div className="page_01_sectioning">04</div>
            <div className="page_01_title">Contact</div>
            <div className="page_01_detail">
              <div>Email: rwnhnslt@gmail.com</div>
              <div><a className="href_links" href="https://www.linkedin.com/in/rowan-henseleit/">LinkedIn</a></div>
            </div>
          </div>
        </Section>
      </SmoothScroll>
    )
  }