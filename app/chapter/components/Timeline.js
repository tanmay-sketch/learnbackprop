"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const VerticalTimeline = dynamic(
  () => import('react-vertical-timeline-component').then((mod) => mod.VerticalTimeline),
  { ssr: false }
);
const VerticalTimelineElement = dynamic(
  () => import('react-vertical-timeline-component').then((mod) => mod.VerticalTimelineElement),
  { ssr: false }
);

const Timeline = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    console.log('Timeline component mounted');
  }, []);

  const timelineData = [
    {
        date: "1960",
        title: "Early Work on Gradient Descent",
        subtitle: "Henry J. Kelley",
        description: "Kelley published work on gradient descent, a precursor to backpropagation, in 1960.",
        link: "https://towardsdatascience.com/gradient-descent-algorithm-a-deep-dive-cf04e8115f21"
    },
    {
        date: "1970",
        title: "Modern Backpropagation",
        subtitle: "Seppo Linnainmaa",
        description: "Published the modern version of backpropagation, also known as the reverse mode of automatic differentiation.",
        link: "https://www.reddit.com/r/MachineLearning/comments/e5vzun/d_jurgen_schmidhuber_on_seppo_linnainmaa_inventor/p"
    },
    {
        date: "1974",
        title: "Backpropagation through time",
        subtitle: "Paul Werbos",
        description: "Developed the backpropagation algorithm in his PhD thesis.",
        link: "https://www.researchgate.net/publication/35657389_Beyond_regression_new_tools_for_prediction_and_analysis_in_the_behavioral_sciences"
    },
    {
        date: "1982",
        title: "Standardizing Backpropagation",
        subtitle: "Paul Werbos",
        description: "Standardized the backpropagation technique for multilayer perceptrons (MLPs).",
        link: "https://axon.cs.byu.edu/Dan/678/papers/Recurrent/Werbos.pdf"
    },
    {
        date: "1986",
        title: "Learning Representations by Back-Propagating Errors",
        subtitle: "David E. Rumelhart, Geoffrey E. Hinton, and Ronald J. Williams",
        description: "Published the influential paper that contributed to the popularization of backpropagation.",
        link: "https://www.youtube.com/watch?v=oq6Z76Gl0ho"
    },
    {
        date: "2010",
        title: "Plain Backpropagation for Deep NNs",
        subtitle: "Dan Ciresan and Jurgen Schmidhuber",
        description: "Demonstrated that deep feedforward neural networks (FNNs) can be trained by plain backpropagation without unsupervised pre-training.",
        link: "https://arxiv.org/pdf/1003.0358"
    },
  ];

  if (!isClient) {
    return null; // or a loading indicator
  }

  return (
    <div className="bg-black text-white p-8">
      <h2 className="text-3xl font-bold text-center mb-12">History of Backpropagation</h2>
      <VerticalTimeline>
        {timelineData.map((data, index) => (
          <VerticalTimelineElement
            key={index}
            className="vertical-timeline-element--education"
            date={data.date}
            dateClassName='text-white'
            iconStyle={{ background: 'rgb(15, 118, 110)', color: '#1a1a1a' }}
            contentStyle={{ background: 'rgb(15, 118, 110)', color: 'white' }}
          >
            <h3 className="vertical-timeline-element-title">{data.title}</h3>
            <h4 className="vertical-timeline-element-subtitle">{data.subtitle}</h4>
            <p>{data.description}</p>
            <div className="mt-4">
              <a href={data.link} target="_blank" rel="noopener noreferrer" className="bg-teal-50 text-black py-2 px-4 rounded hover:bg-amber-700">
                Read more
              </a>
            </div>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
};

export default Timeline;
