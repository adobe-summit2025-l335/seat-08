Skip to content
 
Search Gists
Search...
All gists
Back to GitHub
Sign in
Sign up
Instantly share code, notes, and snippets.

@mhaack
mhaack/_events-list.json
Created 2 days ago
Code
Revisions
1
Clone this repository at &lt;script src=&quot;https://gist.github.com/mhaack/7cfe361c50b0b07a54ca31f084f5a301.js&quot;&gt;&lt;/script&gt;
<script src="https://gist.github.com/mhaack/7cfe361c50b0b07a54ca31f084f5a301.js"></script>
Lesson 8 – Reference Snippets
_events-list.json
{
    "definitions": [
        {
            "title": "Events List",
            "id": "events-list",
            "plugins": {
                "xwalk": {
                    "page": {
                        "resourceType": "core/franklin/components/block/v1/block",
                        "template": {
                            "name": "Events List",
                            "model": "events-list"
                        }
                    }
                }
            }
        }
    ],
    "models": [],
    "filters": []
}
_section.json
"filters": [
    {
      "id": "section",
      "components": [
        "text",
        "image",
        "button",
        "title",
        "hero",
        "cards",
        "columns",
        "fragment",
        "teaser",
        "events-list"
      ]
    }
  ]
events-list.css
:scope {
    --card-title: #ab1ca8;
    --card-border: #de8ade;
}

.events-list>ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(257px, 1fr));
    grid-gap: 24px;
}

.events-list>ul>li {
    border: 1px solid var(--card-border);
    border-radius: 10px;
    background-color: #fff;
    color: #000;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.events-list>ul>li:hover {
    transform: scale(1.05);
}

.events-list .event-content {
    margin: 16px;
}

.events-list .event-content a {
    color: var(--card-title);
}

.events-list .event-content p {
    margin: 0;
    font-size: 14px;
}

.events-list .event-content a:hover {
    text-decoration: none;
}

.events-list>ul>li img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 10px;
}
events-list.js
import ffetch from '../../scripts/ffetch.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Fetches events data from the events index
 * @returns {Promise<Array>} The events data
 */
async function fetchEvents() {
  try {
    const events = await ffetch('/events-index.json').all();
    return events || [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error loading events:', error);
    return [];
  }
}

/**
 * Creates an event list item element
 * @param {Object} event The event data
 * @returns {HTMLElement} The event list item
 */
function createEventElement(event) {
  const li = document.createElement('li');

  // add the event image
  const imgWrapper = document.createElement('div');
  imgWrapper.classList.add('event-image');
  const img = createOptimizedPicture(event.image, event.title);
  imgWrapper.append(img);
  li.append(imgWrapper);

  // add the event title and description
  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('event-content');
  const title = document.createElement('h3');

  const link = document.createElement('a');
  link.href = event.path;
  link.textContent = event.title;
  title.append(link);
  contentWrapper.append(title);
  if (event.description) {
    const desc = document.createElement('p');
    desc.textContent = event.description;
    contentWrapper.append(desc);
  }
  li.append(contentWrapper);

  return li;
}

/**
 * Decorates the events list block
 * @param {HTMLElement} block The events list block element
 */
export default async function decorate(block) {
  try {
    const events = await fetchEvents();

    const ul = document.createElement('ul');
    ul.classList.add('events-list');
    events.forEach((event) => {
      const li = createEventElement(event);
      ul.append(li);
    });

    block.textContent = '';
    block.append(ul);
  } catch (error) {
    block.textContent = 'Unable to load events';
  }
}
helix-query.yaml
version: 1

indices:
  pages:
    include:
      - '/**'
    exclude:
      - '/**.json'
    target: /query-index.json
    properties:
      lastModified:
        select: none
        value: parseTimestamp(headers["last-modified"], "ddd, DD MMM YYYY hh:mm:ss GMT")
      robots:
        select: head > meta[name="robots"]
        value: attribute(el, "content")
  events:
    include:
      - '/events/**'
    target: /events-index.json
    properties:
      title:
        select: head > meta[property="og:title"]
        value: attribute(el, "content")
      description:
        select: head > meta[name="description"]
        value: attribute(el, "content")
      image:
        select: head > meta[property="og:image"]
        value: attribute(el, 'content')
      lastModified:
        select: none
        value: parseTimestamp(headers["last-modified"], "ddd, DD MMM YYYY hh:mm:ss GMT")
      robots:
        select: head > meta[name="robots"]
        value: attribute(el, "content")
 to join this conversation on GitHub. Already have an account? Sign in to comment
Footer
© 2025 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact
Manage cookies
Do not share my personal information
