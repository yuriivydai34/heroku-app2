'use client';

import React, { useEffect, useState } from 'react';

const Feeds = () => {
  const [feeds, setFeeds] = useState([]);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await fetch('https://lit-beyond-54727-bf04242ac7e8.herokuapp.com/feed');
        const data = await response.json();
        setFeeds(data);
        console.log('Fetched feeds:', data);
      } catch (error) {
        console.error('Error fetching feed:', error);
      }
    };

    fetchFeeds();
  }, []);

  return (
    <div>
      <h2>Feeds</h2>
      {/* <ul>
        {feeds.map(feed => (
          <li key={feed.id}>{feed.title}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default Feeds;