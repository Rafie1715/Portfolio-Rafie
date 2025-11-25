// src/data/projects.js

// Import images agar diproses oleh Vite (Opsional jika ditaruh di folder public, tapi disarankan via import di src)
// Jika Anda menaruh gambar di folder 'public/images', Anda bisa pakai string path langsung '/images/nama.png'
// Tapi untuk tutorial ini, kita asumsikan gambar ada di src/assets/images/ dan kita gunakan path string relatif.

export const projects = [
  {
    id: "planetku",
    title: "Planetku (Smart Waste Management App)",
    category: "mobile",
    image: new URL('../assets/images/project-planetku.png', import.meta.url).href,
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
      new URL('../assets/images/Planetku1.png', import.meta.url).href,
      new URL('../assets/images/Planetku2.png', import.meta.url).href,
      new URL('../assets/images/Planetku3.png', import.meta.url).href,
      new URL('../assets/images/Planetku4.png', import.meta.url).href,
      new URL('../assets/images/Planetku5.png', import.meta.url).href
    ]
  },
  {
    id: "cinemazone",
    title: "CinemaZone - Movie Ticket Booking App",
    category: "mobile",
    image: new URL('../assets/images/project-cinemazone.png', import.meta.url).href,
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
      new URL('../assets/images/project-cinemazone2.png', import.meta.url).href,
      new URL('../assets/images/project-cinemazone3.png', import.meta.url).href
    ]
  },
  {
    id: "computer-crafter",
    title: "Computer Crafter Website",
    category: "web",
    image: new URL('../assets/images/project-computercrafter.png', import.meta.url).href,
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
       new URL('../assets/images/project-computercrafter2.png', import.meta.url).href
    ]
  },
  {
    id: "lamimin",
    title: "LaMiMin (Lapar Miskin Minus) UI/UX",
    category: "ui",
    image: new URL('../assets/images/project-lamimin.png', import.meta.url).href,
    shortDesc: "App interface design focused on SDG 1 (No Poverty) and SDG 2 (Zero Hunger).",
    fullDesc: "This application interface was designed to address two critical Sustainable Development Goals (SDGs): SDG 1 (No Poverty) and SDG 2 (Zero Hunger). We chose these themes because poverty and hunger are fundamental, interconnected issues.",
    challenges: "Creating an intuitive and trustworthy user experience. Key considerations included making the donation process as simple as possible and ensuring transparency in fund distribution.",
    solution: "We used Figma to create wireframes, high-fidelity mockups, and an interactive prototype to simulate the user flow from discovery to donation.",
    techStack: [
      { name: "Figma", icon: "devicon-figma-plain" }
    ],
    // HAPUS bagian 'github', GANTI dengan dua ini:
    figma: "https://www.figma.com/design/abLUBq3MKWlLsFA70Foznn/Lamimin?node-id=0-1&node-type=canvas&t=PlGVttlcvHZiLx4B-0",
    prototype: "https://www.figma.com/proto/abLUBq3MKWlLsFA70Foznn/Lamimin?node-id=48-537&node-type=canvas&t=sdLMx6dqWfX4HUzo-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=2%3A2",
    gallery: [
      new URL('../assets/images/project-lamimin2.png', import.meta.url).href
    ]
  },
  {
    id: "library-system",
    title: "Library Book Lending System",
    category: "java",
    image: new URL('../assets/images/project-library-system.png', import.meta.url).href,
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
    image: new URL('../assets/images/project-tools-launcher.png', import.meta.url).href,
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
    image: new URL('../assets/images/project-mangosteen-detector.png', import.meta.url).href,
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
    image: new URL('../assets/images/project-temp-converter.png', import.meta.url).href,
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
    image: new URL('../assets/images/project-sdgs-website.png', import.meta.url).href,
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
  }
];