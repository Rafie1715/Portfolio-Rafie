export const projects = [
  {
    id: "planetku",
    title: "Planetku (Smart Waste Management App)",
    category: "mobile",
    image: "/images/project-planetku.webp",
    shortDesc: "Capstone project for Bangkit 2024. Features AI-powered waste classification, carbon calculation, and waste bank locator.",
    fullDesc: "Waste management is a significant challenge in many urban areas. The goal of Planetku was to create a mobile application that empowers users to manage their waste more effectively and sustainably. The app aims to solve problems like incorrect waste sorting, lack of awareness about recycling value, and difficulty in finding nearby waste banks.",
    challenges: "One of the biggest challenges was implementing the camera-based waste classification feature efficiently without slowing down the user's device. The initial model was quite large and slow.",
    solution: "We worked closely with the Machine Learning team to optimize the TensorFlow Lite model for mobile deployment. On the app side, I implemented asynchronous processing (`Coroutines` in Kotlin) to ensure the UI remained responsive while the image was being analyzed in the background.",
    techStack: [
      { name: "Kotlin", icon: "devicon-kotlin-plain" },
      { name: "Android Studio", icon: "devicon-androidstudio-plain" },
      { name: "Firebase", icon: "devicon-firebase-plain" },
      { name: "TensorFlow", icon: "devicon-tensorflow-original" }
    ],
    github: "https://github.com/PlanetKu-Capstone",
    gallery: [
      "/images/Planetku1.webp",
      "/images/Planetku2.webp",
      "/images/Planetku3.webp",
      "/images/Planetku4.webp",
      "/images/Planetku5.webp"
    ]
  },
  {
    id: "cinemazone",
    title: "CinemaZone - Movie Ticket Booking App",
    category: "mobile",
    image: "/images/project-cinemazone.webp",
    shortDesc: "Android app with Firebase Auth, Cloud Firestore for wishlists, and a QR Code e-ticket generator.",
    fullDesc: "The CinemaZone project was developed to create a seamless and feature-rich movie ticket booking experience on an Android platform. The goal was to build an application that handles the entire user journey, from Browse movies and viewing details to selecting seats and generating a digital e-ticket.",
    challenges: "A primary challenge was designing and implementing the interactive seat picker, which needed to visually represent the cinema layout and handle seat selection state (available, selected, occupied) in real-time.",
    solution: "I implemented this using a dynamic GridView in Android. Each seat was an object with a specific state. I used Firebase's Realtime Database to listen for changes, ensuring that if another user booked a seat, the UI would update instantly.",
    techStack: [
      { name: "Kotlin", icon: "devicon-kotlin-plain" },
      { name: "Firebase", icon: "devicon-firebase-plain" },
      { name: "Android Studio", icon: "devicon-androidstudio-plain" }
    ],
    github: "https://github.com/Rafie1715/CinemaZone",
    gallery: [
      "/images/project-cinemazone2.webp",
      "/images/project-cinemazone3.webp"
    ]
  },
  {
    id: "computer-crafter",
    title: "Computer Crafter Website",
    category: "web",
    image: "/images/project-computercrafter.webp",
    shortDesc: "A web-based PC building simulator for enthusiasts and beginners.",
    fullDesc: "The process of building a personal computer can be intimidating for newcomers due to component compatibility issues. Computer Crafter was created to demystify this process, providing a user-friendly platform where users can select PC parts, see a real-time price total, and be confident that their chosen components will work together.",
    challenges: "The most complex part of this project was managing the database of components and implementing the compatibility logic. For example, ensuring a selected CPU was compatible with the chosen motherboard's socket type.",
    solution: "I designed a relational database schema in MySQL to store components with their relevant specifications. Using PHP on the back-end, I created API endpoints that would dynamically filter the options available in the dropdown menus via AJAX.",
    techStack: [
      { name: "HTML5", icon: "devicon-html5-plain" },
      { name: "CSS3", icon: "devicon-css3-plain" },
      { name: "JavaScript", icon: "devicon-javascript-plain" },
      { name: "PHP", icon: "devicon-php-plain" },
      { name: "MySQL", icon: "devicon-mysql-plain" },
      { name: "Bootstrap", icon: "devicon-bootstrap-plain" }
    ],
    github: "https://github.com/inotlusrabka/Project-Web",
    gallery: [
      "/images/project-computercrafter2.webp"
    ]
  },
  {
    id: "lamimin",
    title: "LaMiMin (Lapar Miskin Minus) UI/UX",
    category: "ui",
    image: "/images/project-lamimin.webp",
    shortDesc: "App interface design focused on SDG 1 (No Poverty) and SDG 2 (Zero Hunger).",
    fullDesc: "This application interface was designed to address two critical Sustainable Development Goals (SDGs): SDG 1 (No Poverty) and SDG 2 (Zero Hunger). We chose these themes because poverty and hunger are fundamental, interconnected issues.",
    challenges: "Creating an intuitive and trustworthy user experience. Key considerations included making the donation process as simple as possible and ensuring transparency in fund distribution.",
    solution: "We used Figma to create wireframes, high-fidelity mockups, and an interactive prototype to simulate the user flow from discovery to donation.",
    techStack: [
      { name: "Figma", icon: "devicon-figma-plain" }
    ],
    figma: "https://www.figma.com/design/abLUBq3MKWlLsFA70Foznn/Lamimin?node-id=0-1&node-type=canvas&t=PlGVttlcvHZiLx4B-0",
    prototype: "https://www.figma.com/proto/abLUBq3MKWlLsFA70Foznn/Lamimin?node-id=48-537&node-type=canvas&t=sdLMx6dqWfX4HUzo-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=2%3A2",
    gallery: [
      "/images/project-lamimin2.webp"
    ]
  },
  {
    id: "library-system",
    title: "Library Book Lending System",
    category: "java",
    image: "/images/project-library-system.webp",
    shortDesc: "A Java-based program to efficiently manage book loans, featuring user registration and loan tracking.",
    fullDesc: "This project was created to provide a simple yet robust solution for managing book loans in a small library. The application handles essential functions such as cataloging books, registering users, and tracking the status of each loan (borrowed or returned).",
    challenges: "The primary challenge was designing an intuitive Graphical User Interface (GUI) using Java's Swing library, which can be less straightforward than modern UI frameworks.",
    solution: "I dedicated significant time to learning the intricacies of Swing's layout managers (like `BorderLayout`, `GridLayout`). By carefully nesting `JPanel` components, I built a structured and responsive layout manually.",
    techStack: [
      { name: "Java", icon: "devicon-java-plain" },
      { name: "IntelliJ IDEA", icon: "devicon-intellij-plain" }
    ],
    github: "https://github.com/Rafie1715/ProjekUASPBOPerpustakaan",
    gallery: []
  },
  {
    id: "tools-launcher",
    title: "Tools Launcher Program",
    category: "python",
    image: "/images/project-tools-launcher.webp",
    shortDesc: "A desktop tools launcher built with Python and the Tkinter library.",
    fullDesc: "This project aims to develop a tools launcher program using Python and the Tkinter library for the GUI. The launcher provides easy access to four essential tools: a calculator, a to-do list, a notepad, and a whiteboard.",
    challenges: "Integrating multiple distinct functionalities (calculator logic, canvas drawing for whiteboard) into a single cohesive application.",
    solution: "Used Python's modularity to separate the logic for each tool and integrated them into a main dashboard using Tkinter.",
    techStack: [
      { name: "Python", icon: "devicon-python-plain" }
    ],
    github: "https://github.com/Rafie1715/Projek_UAS_AlgoPro1",
    gallery: []
  },
  {
    id: "mangosteen-detect",
    title: "Mangosteen Maturity Detection",
    category: "python",
    image: "/images/project-mangosteen-detector.webp",
    shortDesc: "A Python application using OpenCV to detect mangosteen maturity based on its skin color.",
    fullDesc: "Manually sorting fruit by maturity is a time-consuming process. This project aimed to automate the detection of mangosteen maturity by analyzing the fruit's skin color using Image Processing.",
    challenges: "Accurately distinguishing between ripe and unripe fruit under varying lighting conditions. Simple RGB analysis was unreliable.",
    solution: "Implemented image processing using the HSV (Hue, Saturation, Value) color space, which is less sensitive to lighting. Applied thresholding on the Hue channel and morphological operations to isolate the fruit.",
    techStack: [
      { name: "Python", icon: "devicon-python-plain" },
      { name: "OpenCV", icon: "devicon-opencv-plain" }
    ],
    github: "https://github.com/Rafie1715/Projek_UAS_PCD",
    gallery: []
  },
   {
    id: "temp-converter",
    title: "Temperature Converter Website",
    category: "web",
    image: "/images/project-temp-converter.webp",
    shortDesc: "A user-friendly website for instant Celsius and Fahrenheit conversion.",
    fullDesc: "This project was created to demonstrate fundamental front-end web development skills. It is a user-friendly Temperature Converter website that enables instant and accurate conversion between Celsius and Fahrenheit.",
    challenges: "Implementing the conversion logic dynamically and handling user input validation.",
    solution: "Used vanilla JavaScript DOM manipulation to capture input events and calculate conversions in real-time.",
    techStack: [
      { name: "HTML5", icon: "devicon-html5-plain" },
      { name: "CSS3", icon: "devicon-css3-plain" },
      { name: "JavaScript", icon: "devicon-javascript-plain" }
    ],
    github: "https://github.com/revou-fundamental-course/5-feb-24-Rafie1715",
    live: "https://revou-fundamental-course.github.io/5-feb-24-Rafie1715",
    gallery: []
  },
  {
    id: "sdgs-web",
    title: "Landing Page Website About SDGs",
    category: "web",
    image: "/images/project-sdgs-website.webp",
    shortDesc: "A project-based landing page website to introduce the Sustainable Development Goals (SDGs).",
    fullDesc: "This project was developed as a team-based landing page to provide a clear and concise introduction to the United Nations' Sustainable Development Goals (SDGs).",
    challenges: "Coordinating with a team to merge different sections of the website.",
    solution: "Used Git for version control and clearly defined sections for each team member.",
    techStack: [
       { name: "HTML5", icon: "devicon-html5-plain" },
       { name: "CSS3", icon: "devicon-css3-plain" },
       { name: "Bootstrap", icon: "devicon-bootstrap-plain" }
    ],
    github: "https://github.com/samsamsemy/Landing-page",
    live: "https://landing-page-zeta-two-87.vercel.app",
    gallery: []
  },
  {
    id: "block-breaker",
    title: "Block Breaker Game",
    category: "web",
    image: "/images/project-blockbreaker.webp",
    shortDesc: "A modern 'Breakout' arcade game built from scratch using HTML5 Canvas and AI assistance.",
    fullDesc: "This project is a modern, from-scratch implementation of the classic arcade game 'Breakout'. The game challenges the player to destroy all bricks on the screen by deflecting a ball with a paddle. The primary objective was to build a fully functional, interactive web application using fundamental web technologies, all while documenting how an AI assistant (IBM Granite) was used to accelerate development, optimize code, and debug issues.",
    challenges: "Building a fully functional game engine logic (rendering, physics, collision detection) from scratch using only the Canvas API without relying on external game libraries like Phaser.",
    solution: "Leveraged IBM Granite AI as a co-pilot to generate boilerplate code, develop complex algorithms for collision detection, and implement a state management system (Menu, Playing, Game Over) for smooth game flow.",
    techStack: [
      { name: "HTML5", icon: "devicon-html5-plain" },
      { name: "CSS3", icon: "devicon-css3-plain" },
      { name: "JavaScript", icon: "devicon-javascript-plain" },
    ],
    github: "https://github.com/Rafie1715/Capstone-Project-IBM-Granite",
    live: "https://block-breaker.netlify.app/",
    gallery: [
      "/images/project-blockbreaker2.webp",
      "/images/project-blockbreaker3.webp"
    ]
  },
  {
    id: "quick-quiz",
    title: "QuickQuiz - Multi-Platform App",
    category: "flutter",
    image: "/images/project-quickquiz.webp",
    shortDesc: "A simple, multi-platform quiz application built with Flutter demonstrating state management and clean UI.",
    fullDesc: "QuickQuiz is a general knowledge quiz app designed with a clean, user-friendly interface. The app guides users through a welcome screen, a quiz interface with a progress bar, and a results screen that calculates the score percentage. It demonstrates fundamental mobile development concepts like navigation, local data handling, and responsive UI design.",
    challenges: "Building a consistent UI that works across Android, iOS, Web, and Windows from a single codebase while managing the quiz state (current question index and score) efficiently without external state management libraries.",
    solution: "Utilized Flutter's built-in `StatefulWidget` for logic management and `MaterialPageRoute` for seamless navigation. Implemented a modular project structure separating UI widgets (Home, Quiz, Result) from the data models (`question_model.dart`) for better maintainability.",
    techStack: [
      { name: "Flutter", icon: "devicon-flutter-plain" },
      { name: "Dart", icon: "devicon-dart-plain" },
      { name: "Android Studio", icon: "devicon-androidstudio-plain" }
    ],
    github: "https://github.com/Rafie1715/quickquiz", 
    gallery: [
      "/images/project-quickquiz2.webp",
      "/images/project-quickquiz3.webp",
      "/images/project-quickquiz4.webp",
      "/images/project-quickquiz5.webp"
    ]
  },
  {
    id: "personal-notes",
    title: "Personal Notes App (React)",
    category: "web",
    image: "/images/project-notesapp.webp",
    shortDesc: "A comprehensive note management app with authentication, archiving, and multi-language support.",
    fullDesc: "This web-based application allows users to manage their personal notes efficiently. It features a robust system for creating, archiving, and deleting notes, secured by user authentication. The app enhances user experience with real-time search, theme customization (Dark/Light mode), and multi-language support (English/Indonesian).",
    challenges: "Managing complex global states like theme and language preferences across the application while ensuring seamless navigation and protected routes for authenticated users.",
    solution: "Implemented React Context API for efficient global state management (Theme & Locale). Used React Router DOM for handling navigation and protecting routes requiring authentication. Integrated a REST API for persistent data storage and user management.",
    techStack: [
      { name: "React", icon: "devicon-react-original" },
      { name: "Vite", icon: "devicon-vitejs-plain" },
      { name: "CSS3", icon: "devicon-css3-plain" }
    ],
    github: "https://github.com/Rafie1715/personal-notes-app-with-react", 
    live: "https://reactpersonalnotes.netlify.app",
    gallery: [
      "/images/project-notesapp2.webp",
      "/images/project-notesapp3.webp",
      "/images/project-notesapp4.webp"
    ] 
  }
];