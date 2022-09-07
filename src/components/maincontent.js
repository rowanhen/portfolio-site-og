import Section from './section/Section';
import '../styles/pagecontent.css';
import AnimatedText from './AnimatedText';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import useWindowSize from '../hooks/useWindowSize';

const StyledPageWrapper = styled(motion.span)`
  user-select: none;
  display: inline-block;
  color: #ffbf00;
  mix-color-blend-mode: difference;
  margin-top: 100px;
`;

const sectionOne = [
  { text: '<01>', className: 'page_01_sectioning' },
  {
    text: 'Rowan Henseleit',
    className: 'page_01_title',
  },
  {
    text: 'Software Engineer & Creative Coder',
    className: 'page_01_detail',
  },
];

const sectionOneMobile = [
  { text: '<01>', className: 'page_01_sectioning' },
  {
    text: 'Rowan',
    className: 'page_01_title',
  },
  {
    text: 'Henseleit',
    className: 'page_01_title',
  },
  {
    text: 'Software Engineer & Creative',
    className: 'page_01_detail',
  },
  {
    text: 'Coder',
    className: 'page_01_detail',
  },
];

const container = {
  visible: {
    transition: {
      staggerChildren: 0.0,
    },
  },
};

const PageText = () => {
  const windowSize = useWindowSize();
  return (
    <>
      <Section flexDirection="row">
        <StyledPageWrapper
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }}
          variants={container}
        >
          {windowSize.width > 1000
            ? sectionOne.map((item, index) => {
                return <AnimatedText {...item} key={index} />;
              })
            : sectionOneMobile.map((item, index) => {
                return <AnimatedText {...item} key={index} />;
              })}
        </StyledPageWrapper>
      </Section>
      <Section flexDirection="row-reverse">
        <div className="page_01_wrapper">
          <div className="page_01_sectioning">
            {'<'}02{'>'}
          </div>
          <div className="page_01_title">Skills</div>
          <div className="page_01_detail">
            React & JS Developer specialising in Front-End Development
          </div>
        </div>
      </Section>
      <Section flexDirection="row">
        <div className="page_01_wrapper">
          <div className="page_01_sectioning">
            {'<'}03{'>'}
          </div>
          <div className="page_01_title">Projects</div>
          <div className="page_01_detail">
            <div>
              <a className="href_links" href="https://warmm.co.uk">
                https://warmm.co.uk
              </a>
            </div>
            <div>
              <a className="href_links" href="https://3m0j15.netlify.app">
                https://3m0j15.netlify.app
              </a>
            </div>
            <div>
              <a className="href_links" href="https://vitalstudios.co">
                https://vitalstudios.co
              </a>
            </div>
            <div>
              <a className="href_links" href="https://prototype26.netlify.app">
                https://prototype26.netlify.app
              </a>
            </div>
          </div>
        </div>
      </Section>
      <Section flexDirection="row-reverse">
        <div className="page_01_wrapper">
          <div className="page_01_sectioning">
            {'<'}04{'>'}
          </div>
          <div className="page_01_title">Contact</div>
          <div className="page_01_detail">
            <div>Email: rwnhnslt@gmail.com</div>
            <div>
              <a
                className="href_links"
                href="https://www.linkedin.com/in/rowan-henseleit/"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export const PageContent = () => {
  return <PageText />;
};
