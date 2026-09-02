import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            navbar: {
                home: "Home",
                about: "About",
                projects: "Projects",
                blog: "Blog",
                workspace: "Workspace",
                afk: "AFK",
                contact: "Contact"
            },
            home: {
                highlights: "Portfolio Highlights",
                featured_work: "Selected Work",
                glimpse: "A few projects that show how I think, build, and solve problems.",
                view_work: "About Me",
                view_all: "View All Projects",
                latest_blog: "Latest from Blog",
                blog_glimpse: "Thoughts on web development, mobile apps, and learning",
                view_all_blogs: "View All Blogs",
                afk_teaser: {
                    eyebrow: "Beyond Coding",
                    title: "A glimpse beyond the code",
                    desc: "See what I listen to, play, and watch. It is where I recharge and often find new ideas.",
                    cta: "Open /afk"
                },
                beyond: {
                    eyebrow: "Beyond the Code",
                    title: "A little life beyond the commit history",
                    subtitle: "A quick look at what is in rotation and where I am building from.",
                    view_afk: "Explore my /afk side",
                    music_label: "Current Rotation",
                    music_period: "Favorites from the last six months",
                    refresh: "Refresh Spotify tracks",
                    refreshing: "Refreshing Spotify tracks",
                    loaded: "Spotify tracks are ready",
                    open_spotify: "Open on Spotify",
                    play_track: "Play {{title}}",
                    player_ready: "Ready to play",
                    player_title: "Spotify player",
                    close_player: "Close player",
                    location_label: "Based in",
                    location: "Jakarta, Indonesia",
                    availability: "Open to remote and Jakarta-based opportunities",
                    contact: "Start a conversation"
                },
                recruiter_lens: {
                    eyebrow: "Recruiter Lens",
                    control_label: "Choose a portfolio focus",
                    copy_link: "Copy a shareable link to this focus",
                    link_copied: "Focused portfolio link copied",
                    copy_error: "The focused portfolio link could not be copied",
                    project_proof: "Evidence",
                    highlighting_technology: "Highlighting work built with {{technology}}",
                    clear_technology: "Clear technology highlight",
                    related_project: "Uses {{technology}}",
                    living_stack: {
                        eyebrow: "Living Tech Stack",
                        title: "Tools connected to shipped work",
                        summary: "Choose a technology to see its role and highlight the projects where I applied it.",
                        control_label: "Choose a technology to explore",
                        active_label: "Selected technology",
                        used_in: "Used in"
                    },
                    technologies: {
                        kotlin: {
                            role: "Primary language for native Android development",
                            usage: "RestUP, Mandiri News, and Planetku"
                        },
                        android_studio: {
                            role: "Development environment for Android delivery",
                            usage: "RestUP, Mandiri News, and Planetku"
                        },
                        firebase: {
                            role: "Authentication and product data services",
                            usage: "RestUP, Planetku, and this portfolio"
                        },
                        gradle: {
                            role: "Android build and dependency workflow",
                            usage: "RestUP, Mandiri News, and Planetku"
                        },
                        tensorflow: {
                            role: "On-device machine learning integration",
                            usage: "Planetku waste classification"
                        },
                        react: {
                            role: "Component-driven front-end development",
                            usage: "Personal Portfolio and Personal Notes"
                        },
                        javascript: {
                            role: "Interactive browser and application logic",
                            usage: "Computer Crafter, Personal Portfolio, and Personal Notes"
                        },
                        vite: {
                            role: "Fast front-end development and production builds",
                            usage: "Personal Portfolio and Personal Notes"
                        },
                        tailwind: {
                            role: "Responsive design system implementation",
                            usage: "Personal Portfolio"
                        },
                        php: {
                            role: "Server-side compatibility and catalog logic",
                            usage: "Computer Crafter"
                        },
                        mysql: {
                            role: "Relational component catalog and specifications",
                            usage: "Computer Crafter"
                        },
                        python: {
                            role: "Machine learning experimentation and analysis",
                            usage: "RestUP and Deepseek Sentiment Analysis"
                        },
                        scikit_learn: {
                            role: "Classical model training and evaluation",
                            usage: "RestUP and Deepseek Sentiment Analysis"
                        },
                        pandas: {
                            role: "Dataset preparation and analytical workflows",
                            usage: "Deepseek Sentiment Analysis"
                        }
                    },
                    options: {
                        overview: "Overview",
                        android: "Android",
                        frontend: "Front-End",
                        ai: "AI / ML"
                    },
                    modes: {
                        overview: {
                            title: "A focused view of how I build",
                            summary: "Scan the complete profile or choose a role to surface the most relevant projects, stack, and outcomes.",
                            tagline: "Recent Informatics graduate building practical Android, front-end, and AI-integrated products.",
                            focus: "Android, Front-End & AI",
                            stack: "Kotlin, React, Firebase",
                            hero_phrases: [
                                "practical Android products.",
                                "responsive web experiences.",
                                "useful AI-integrated features."
                            ],
                            work_title: "Selected Work",
                            work_summary: "Three projects that show product ownership, technical range, and measurable outcomes.",
                            seo_title: "Rafie Rojagat | Software Engineer Portfolio",
                            seo_desc: "Portfolio of Rafie Rojagat Bachri, an Informatics graduate building Android, front-end, and AI-integrated products with Kotlin and React.",
                            proof: [
                                { label: "Education", value: "Informatics graduate, GPA 3.89/4.00" },
                                { label: "Delivery", value: "Independent and 6-member team projects" },
                                { label: "Availability", value: "Open to internships and entry-level roles" }
                            ]
                        },
                        android: {
                            title: "Android product engineering",
                            summary: "Native Android work centered on reliable architecture, asynchronous data, and product-ready mobile flows.",
                            tagline: "Android-focused developer building reliable Kotlin products with structured data and state.",
                            focus: "Native Android",
                            stack: "Kotlin, MVVM, Coroutines",
                            hero_phrases: [
                                "native Kotlin applications.",
                                "reliable MVVM data flows.",
                                "responsive Android features."
                            ],
                            work_title: "Selected Android Work",
                            work_summary: "Android projects covering REST pagination, Firebase workflows, and on-device machine learning.",
                            seo_title: "Rafie Rojagat | Android Developer Portfolio",
                            seo_desc: "Android developer portfolio featuring Kotlin, MVVM, Coroutines, Retrofit, Firebase, and on-device machine learning projects.",
                            proof: [
                                { label: "Core stack", value: "Kotlin, MVVM, Retrofit, Coroutines" },
                                { label: "Delivery proof", value: "Three detailed Android case studies" },
                                { label: "Strongest result", value: "Mandiri project score 88.71/100" }
                            ]
                        },
                        frontend: {
                            title: "Front-end and web product development",
                            summary: "Responsive interfaces backed by practical state, accessibility, performance, and data integration decisions.",
                            tagline: "Front-end developer building responsive React products and practical full-stack web experiences.",
                            focus: "Front-End & Web",
                            stack: "React, Vite, Tailwind",
                            hero_phrases: [
                                "responsive React interfaces.",
                                "accessible web interactions.",
                                "maintainable front-end systems."
                            ],
                            work_title: "Selected Front-End Work",
                            work_summary: "Web projects spanning React applications, compatibility logic, responsive UI, and live delivery.",
                            seo_title: "Rafie Rojagat | Front-End Developer Portfolio",
                            seo_desc: "Front-end developer portfolio featuring React, Vite, Tailwind CSS, responsive interfaces, and practical web products.",
                            proof: [
                                { label: "Core stack", value: "React, JavaScript, Vite, Tailwind CSS" },
                                { label: "Product range", value: "Responsive UI and full-stack web logic" },
                                { label: "Delivery proof", value: "Three focused web case studies" }
                            ]
                        },
                        ai: {
                            title: "Applied AI and machine learning",
                            summary: "Model evaluation connected to understandable mobile and product experiences, not isolated notebook results.",
                            tagline: "Applied AI developer connecting evaluated models with practical product experiences.",
                            focus: "Applied AI & ML",
                            stack: "Scikit-Learn, TFLite, OpenCV",
                            hero_phrases: [
                                "evaluated machine learning models.",
                                "on-device AI features.",
                                "AI outputs users can understand."
                            ],
                            work_title: "Selected AI & ML Work",
                            work_summary: "Applied ML projects covering health classification, on-device vision, and sentiment analysis.",
                            seo_title: "Rafie Rojagat | Applied AI Developer Portfolio",
                            seo_desc: "Applied AI portfolio featuring Scikit-Learn, TensorFlow Lite, OpenCV, model evaluation, and AI-integrated products.",
                            proof: [
                                { label: "Model evaluation", value: "92.06% sleep classification accuracy" },
                                { label: "On-device AI", value: "90% waste classification accuracy" },
                                { label: "NLP project", value: "87.67% sentiment model accuracy" }
                            ]
                        }
                    }
                }
            },
            about: {
                title: "About Me",
                eyebrow: "Mobile, Front-End & AI Developer",
                headline: "I turn product ideas into practical Android and web experiences.",
                summary: "I am a recent Informatics graduate from UPN Veteran Jakarta with a 3.89/4.00 GPA, focused on Android, front-end, and AI-integrated development.",
                summary_secondary: "My work combines Kotlin, React.js, machine learning, Clean Architecture, and MVVM to build products that are useful, maintainable, and grounded in real user needs.",
                location: "North Jakarta, Indonesia",
                availability: "Open to internships and entry-level roles",
                view_projects: "View Projects",
                contact: "Contact Me",
                snapshot: {
                    graduate: "Informatics graduate",
                    gpa: "GPA / 4.00",
                    mandiri: "Mandiri project score",
                    ml_accuracy: "Thesis model accuracy",
                    bangkit_hours: "Bangkit learning hours"
                },
                education: {
                    title: "Education",
                    subtitle: "Academic foundation behind my engineering work.",
                    degree: "Bachelor of Informatics",
                    note: "Focused on software engineering, Android development, web products, and applied machine learning.",
                    period: "Aug 2022 - Jul 2026"
                },
                profile_lab: {
                    title: "Developer ID",
                    subtitle: "A concise profile badge with an optional, lightweight 3D preview.",
                    show_profile: "Open Profile Card",
                    hide_profile: "Close Profile Card",
                    show_3d: "View 3D Badge",
                    hide_3d: "Hide 3D Badge"
                },
                download_cv: "Download CV",
                hello: "Hello, I'm",
                desc1: "I'm a recent <1>Informatics graduate</1> from UPN “Veteran” Jakarta with a strong interest in <3>Front-End and Mobile Development</3>.",
                desc2: "Skilled in building responsive apps using <1>JavaScript</1>, <3>React</3>, and <5>Kotlin</5>. Highly motivated to enhance technical skills through internship opportunities to create impactful digital solutions.",
                card_label: "Profile Card",
                card_note: "Classic Card is shown by default for a cleaner reading flow.",
                card_show_3d: "Show 3D Preview",
                card_hide_3d: "Hide 3D Preview",
                card_preview_hint: "Drag to interact. This preview is experimental.",
                card_loading_3d: "Loading interactive 3D preview...",
                edu_title: "Education",
                uni_name: "Universitas Pembangunan Nasional \"Veteran\" Jakarta",
                uni_major: "Informatics (2022 - 2026)",
                hs_name: "SMA Negeri 13 Jakarta",
                hs_major: "Science (2019 - 2022)"
            },
            hero: {
                greeting: "Hi there, I'm",
                tagline: "Recent Informatics graduate building practical mobile and web products with React and Kotlin.",
                typewriter_prefix: "I build",
                role_phrases: [
                    "practical mobile applications.",
                    "responsive web experiences.",
                    "products with React and Kotlin."
                ],
                view_work: "About Me",
                view_projects: "View Projects",
                download_cv: "Download CV",
                contact_me: "Let's Connect",
                afk_cta: {
                    prefix: "Want a quick look outside my coding life?",
                    link: "Visit /afk"
                },
                quick_facts: {
                    location: "Jakarta, Indonesia",
                    availability: "Open to Opportunities",
                    focus: "Mobile and Web",
                    stack: "React, Kotlin, Firebase"
                }
            },
            footer: {
                description: "Building digital experiences with code and creativity. Let's create something amazing together.",
                quick_links: "Quick Links",
                connect: "Connect",
                download_cv: "Download CV",
                rights: "All rights reserved.",
                made_with: "Made with",
                and: "and",
                in: "in"
            },
            experience: {
                eyebrow: "Applied Experience",
                title: "Selected Experience & Programs",
                subtitle: "Roles and structured programs where I shipped software, led technical learning, and supported other students with measurable outcomes.",
                docs: "Documentation",
                view_docs: "View documentation",
                photo_count: "{{count}} photos",
                open_docs: "Open documentation for {{title}}",
                gallery_label: "Documentation gallery for {{title}}",
                photo_alt: "{{title}} documentation, photo {{current}} of {{total}}",
                close_gallery: "Close gallery",
                previous_photo: "Previous photo",
                next_photo: "Next photo"
            },
            skills: {
                eyebrow: "Core Capabilities",
                title: "Technical Skills",
                description: "A recruiter-friendly view of the technologies I use across Android, web, AI, backend, and delivery workflows.",
                categories: {
                    frontend: {
                        title: "Frontend Engineering",
                        desc: "Building responsive interfaces, polished interactions, and production-ready React pages."
                    },
                    mobile: {
                        title: "Mobile Android",
                        desc: "Building native Android applications with modern UI, structured state, and reliable API integration."
                    },
                    ai: {
                        title: "AI & Machine Learning",
                        desc: "Training practical models and integrating generative AI into development and product workflows."
                    },
                    backend: {
                        title: "Backend & Data",
                        desc: "Working with APIs, databases, authentication, and cloud-backed app workflows."
                    },
                    tools: {
                        title: "Tools & Workflow",
                        desc: "Designing, versioning, debugging, and shipping projects with a reliable toolchain."
                    }
                }
            },
            certifications: {
                eyebrow: "Training & Credentials",
                title: "Selected Certifications",
                subtitle: "CV highlights and relevant earlier technical credentials are shown first. The complete archive remains available without an auto-playing carousel.",
                issued: "Issued",
                verify: "Verify Credential",
                view_all: "View all {{count}} credentials",
                show_selected: "Show selected only",
                preview: "Preview {{title}} certificate",
                close_preview: "Close certificate preview",
                general: "General"
            },
            projects: {
                title: "Featured Projects",
                featured_eyebrow: "Selected Work",
                featured_title: "Featured Case Studies",
                featured_desc: "Five projects selected for their product scope, technical ownership, and measurable outcomes.",
                archive_eyebrow: "More Work",
                archive_title: "Project Archive",
                archive_desc: "Experiments, course projects, design work, and smaller builds grouped for quick scanning.",
                search_results: "Browse Projects",
                results_title: "Project Results",
                project_count: "{{count}} projects match your current search and filter.",
                subtitle: "Recent GitHub Repositories",
                subtitle_desc: "A small, lazily loaded view of recent public code activity.",
                github_eyebrow: "Code Activity",
                view_details: "View Details",
                case_study: "View Case Study",
                live_site: "View Live Site",
                design: "View Design",
                prototype: "Try Prototype",
                source_code: "Source Code",
                conceptual_cover: "Conceptual cover",
                no_projects: "No projects found.",
                loading: "Loading...",
                search_placeholder: "Search name, technology, or keyword",
                clear_search: "Clear project search",
                filter_label: "Filter projects by domain",
                show_all: "Show all {{count}} projects",
                show_less: "Show fewer projects",
                view_github: "View GitHub Profile",
                open_repository: "Open repository",
                no_repo_description: "No repository description provided.",
                github_error: "Recent repositories could not be loaded right now.",
                github_empty: "No public repositories were returned.",
                filter: {
                    all: "All",
                    mobile: "Mobile",
                    web: "Web",
                    ai: "AI & Data",
                    python: "Python",
                    java: "Java",
                    ui: "UI/UX",
                    flutter: "Flutter",
                    game: "Game",
                    other: "Other"
                },
                seo_title: "Projects | Rafie Rojagat",
                seo_desc: "Selected Android, web, and AI case studies by Rafie Rojagat, including project roles, technical decisions, and measurable outcomes."
            },
            projectDetail: {
                category_label: "Project",
                impact: {
                    eyebrow: "Recruiter Snapshot",
                    title: "Selected Impact",
                    desc: "A quick read on what I owned, what the project needed, and where to inspect the work.",
                    role: "Role",
                    team: "Team",
                    result: "Result",
                    scope: "Scope",
                    tech_link: "Tech & Link",
                    team_fallback: "Solo or team project"
                },
                decision_replay: {
                    eyebrow: "Engineering Reasoning",
                    title: "Decision Replay",
                    desc: "Step through the constraints, alternatives, decisions, and evidence behind the finished product.",
                    controls: "Explore engineering decision steps",
                    step_count: "Step {{current}} of {{total}}",
                    steps: {
                        problem: "Problem",
                        constraint: "Constraints",
                        options: "Options considered",
                        decision: "Decision",
                        tradeoff: "Trade-off",
                        evidence: "Evidence"
                    }
                },
                overview: "Project Overview",
                features: "Key Features",
                tech_used: "Technologies Used",
                challenge: "The Challenge",
                solution: "The Solution",
                learned: "What I Learned",
                gallery: "Project Gallery",
                conceptual_cover: "This is a conceptual cover created for portfolio presentation, not a final product screenshot.",
                click_close: "Click outside or press Esc to close"
            },
            workspace: {
                seo_title: "Workspace & Development Tools | Rafie Rojagat",
                seo_desc: "The hardware, development tools, and practical workflow Rafie Rojagat uses to design, build, test, and ship Android and web products.",
                eyebrow: "Core Setup",
                title_prefix: "Tools behind",
                title_highlight: "the work.",
                subtitle: "A practical look at the hardware and software I use to move from an idea to a tested Android or web product.",
                updated: "Last updated: August 2026",
                workflow: {
                    eyebrow: "Working Method",
                    title: "A simple loop from idea to delivery",
                    subtitle: "The tools matter most when they support a clear, repeatable way of working.",
                    plan: {
                        title: "Plan & Prototype",
                        desc: "Clarify requirements, research the problem, and shape interface flows before implementation."
                    },
                    build: {
                        title: "Build & Integrate",
                        desc: "Implement Android or web features, connect data, and keep architecture maintainable."
                    },
                    validate: {
                        title: "Test & Deliver",
                        desc: "Validate APIs and real-device behavior, review changes, then prepare a reliable release."
                    }
                },
                stack: {
                    eyebrow: "Current Stack",
                    title: "Hardware and tools",
                    subtitle: "A focused setup selected for product work, not a complete inventory of every app I have tried.",
                    count: "{{count}} items",
                    filter_label: "Filter workspace items by category"
                },
                groups: {
                    all: "All",
                    hardware: "Hardware",
                    development: "Development",
                    design_productivity: "Design & Productivity",
                    testing_delivery: "Testing & Delivery"
                },
                view_details: "View details",
                open_details: "Open details for {{title}}",
                close_preview: "Close workspace details",
                purpose: "How I use it",
                official_site: "Official site",
                product_page: "Product page",
                github_profile: "GitHub profile"
            },
            pages: {
                projects: {
                    title_prefix: "My",
                    title_highlight: "Projects",
                    subtitle: "Selected Android, web, and AI work presented through the problems, decisions, and outcomes behind each build."
                },
                about: {
                    title_prefix: "About",
                    title_highlight: "Rafie",
                    subtitle: "Recent Informatics graduate building Android, front-end, and AI-integrated products with an emphasis on practical outcomes."
                },
                blog: {
                    seo_title: "Engineering Notes & Case Studies | Rafie Rojagat",
                    seo_desc: "Android, web, machine learning, and teaching case studies by Rafie Rojagat Bachri.",
                    eyebrow: "Writing & Case Studies",
                    title_prefix: "Engineering",
                    title_highlight: "Notes.",
                    subtitle: "Practical notes on building Android, web, and AI-integrated products, plus lessons from teaching technical topics.",
                    featured_eyebrow: "Featured Case Study",
                    featured_badge: "Featured",
                    recent_eyebrow: "Explore the Archive",
                    recent_title: "Recent writing",
                    recent_subtitle: "Case studies, implementation notes, and CodeVox teaching sessions.",
                    search_label: "Search articles",
                    search_placeholder: "Search articles...",
                    clear_search: "Clear search",
                    filter_label: "Filter articles by topic",
                    categories: {
                        all: "All",
                        "case-study": "Case Studies",
                        android: "Android",
                        web: "Web",
                        learning: "Learning"
                    },
                    article_count_one: "{{count}} article",
                    article_count_other: "{{count}} articles",
                    read_time_one: "{{count}} min read",
                    read_time_other: "{{count}} min read",
                    read_article: "Read article",
                    empty_title: "No matching articles",
                    empty_desc: "Try another keyword or topic.",
                    back: "Back to Blog",
                    published: "Published",
                    updated: "Updated",
                    share: "Share article",
                    copied: "Link copied",
                    impact_eyebrow: "Selected Impact",
                    role: "Role",
                    team: "Team",
                    result: "Result",
                    scope: "Scope",
                    video_eyebrow: "Session Recording",
                    play_video: "Play video",
                    video_note: "The YouTube player loads only after you choose to play it.",
                    open_project: "View project details",
                    related_eyebrow: "Keep Reading",
                    related_title: "Related articles"
                },
                contact: {
                    eyebrow: "Open to Opportunities",
                    title_prefix: "Let's build",
                    title_highlight: "something useful.",
                    subtitle: "I'm open to Android, front-end, and AI-integrated software opportunities. Tell me what you're hiring or building for."
                }
            },
            afk: {
                subtitle: "Away From Keyboard.",
                seo_desc: "Games, Music, and Movies.",
                intro_line1: "This page captures my rhythm outside coding, from what I listen to, to what I play and watch.",
                intro_line2: "For me, AFK moments often become a source of ideas when I get back to building.",
                afk_snapshot: {
                    title: "A quick snapshot",
                    label: "Currently",
                    musik: { label: "Music", desc: "Chill / Focus Playlist" },
                    game: { label: "Game", desc: "Steam + Mini Game" },
                    film: { label: "Film", desc: "Recommendations & Watchlist" }
                },
                music_note: "The playlist I reach for when I need to reset, focus, or find a rhythm before building again.",
                cinema_note: "A compact diary of stories that stayed with me, rather than a complete watch history.",
                watchlist_note: "A short queue of films I want to make time for next.",
                playful_break: "Playful break",
                currently_live: "Live from Discord",
                films: "films",
                no_movies: "No cinema picks are available right now.",
                no_score: "No score yet",
                show_archive: "Show {{count}} more years",
                hide_archive: "Hide archive",
                open_spotify: "Open in Spotify",
                close_player: "Close player",
                spotify_ranges: {
                    four_weeks: "4 weeks",
                    six_months: "6 months",
                    all_time: "All time"
                },
                play_track: "Play",
                spotify_status: {
                    now_playing: "Now playing",
                    last_played: "Last played",
                    not_playing: "Nothing is playing right now.",
                    unavailable: "Spotify data is unavailable right now.",
                    no_tracks: "No tracks found."
                },
                reaction_game: {
                    title: "Reaction Time",
                    subtitle: "Click when the button changes color. The smaller the value, the faster your reflexes.",
                    status: "Status",
                    best: "Best",
                    last: "Last",
                    start_btn: "Start",
                    waiting_btn: "Don't click yet",
                    go_btn: "CLICK NOW!",
                    retry_btn: "Try Again",
                    restart_btn: "Restart",
                    reset_btn: "Reset",
                    status_ready: "Ready",
                    status_wait: "Wait",
                    status_go: "Go!",
                    status_result: "Result",
                    message_ready: "Press start, then click when the button changes color.",
                    message_wait: "Get ready... wait for the button to change color.",
                    message_go: "Now! Click as fast as possible.",
                    message_early: "Too early. Try again and wait for the color to change.",
                    message_saved: "Score saved to Firebase.",
                    leaderboard: {
                        title: "Top 5 Scores",
                        empty: "No scores yet. Try playing once.",
                        desc: "Reaction Score",
                        gold: "Gold",
                        silver: "Silver",
                        bronze: "Bronze",
                        champion: "Champion 1"
                    }
                },
                status_check: "Status Check",
                playing: "Playing",
                offline: "Offline",
                chilling: "Currently chilling...",
                on_repeat: "On Repeat",
                top_tracks: "Top Tracks This Month",
                recent_games: "Recently Played",
                no_recent_games: "No recent activity.",
                cinema_log: "Cinema Log",
                want_to_watch: "Want to Watch",
                no_watchlist: "No watchlist yet.",
                now_in_cinema: "Now in Cinema",
                no_now_in_cinema: "No cinema data available right now.",
                rafie_picks: "Rafie's Picks",
                curated_pick: "Curated Pick",
                no_rafie_picks: "No curated picks yet.",
                best_year: "Best of Year",
                steam_library: "Steam Library",
                hours: "hrs total",
                view_library: "View Full Library",
                spotify: "My Spotify",
                now_playing: "Now Playing"
            },
            chatbot: {
                title: "Rafie Assistant",
                status: "Portfolio guide",
                open: "Open Rafie Assistant",
                close: "Close Rafie Assistant",
                reset: "Start a new conversation",
                welcome: "Hi, I'm Rafie's portfolio assistant. Ask me about his projects, experience, skills, or availability.",
                quick_ask: "Quick ask",
                input_label: "Message Rafie's portfolio assistant",
                placeholder: "Ask about Rafie's work...",
                send: "Send message",
                loading: "Thinking...",
                retry: "Try again",
                privacy: "AI answers may be imperfect. Messages are processed by Google Gemini; do not share sensitive information.",
                suggestions: {
                    experience: {
                        label: "Experience",
                        prompt: "What is Rafie's professional and program experience?"
                    },
                    impact: {
                        label: "Project impact",
                        prompt: "Which Rafie projects have the strongest measurable impact?"
                    },
                    stack: {
                        label: "Tech stack",
                        prompt: "What technologies and engineering skills does Rafie use?"
                    },
                    availability: {
                        label: "Availability",
                        prompt: "Is Rafie available for hiring, internships, or collaboration?"
                    }
                },
                actions: {
                    projects: "View projects",
                    about: "View experience",
                    workspace: "View stack",
                    contact: "Contact Rafie",
                    cv: "Download CV"
                },
                errors: {
                    generic: "I couldn't reach the assistant just now. Please try again.",
                    timeout: "The response took too long. Please check your connection and try again.",
                    rate_limit: "You've sent several messages quickly. Please wait a minute and try again.",
                    invalid: "That message could not be processed. Shorten it and try again.",
                    unavailable: "The assistant is temporarily unavailable. You can still use the Contact page."
                }
            },
            contact: {
                seo_title: "Contact | Rafie Rojagat",
                seo_desc: "Contact Rafie Rojagat for Android, front-end, or AI-integrated software opportunities, internships, and collaborations.",
                title: "Get In Touch",
                subtitle: "Have a project in mind? I'm open to discussing software roles, collaborations, and practical products.",
                availability_label: "Current availability",
                availability: "Open to entry-level roles, internships, and collaborations",
                info_title: "Contact details",
                location: "Location",
                response_time_label: "Response time",
                response_time: "Typically within 1-2 business days",
                copy_email: "Copy email address",
                email_copied: "Email address copied",
                download_cv: "Download CV",
                profiles: "Other profiles",
                open_profile: "Open",
                form: {
                    eyebrow: "Start a conversation",
                    title: "Tell me about the opportunity",
                    subtitle: "Share the role, project, or problem you have in mind. A little context helps me respond with something useful.",
                    name_label: "Name",
                    name_placeholder: "Enter your full name",
                    email_label: "Email",
                    email_placeholder: "Enter your email address",
                    topic_label: "Topic",
                    topic_placeholder: "Choose the reason for reaching out",
                    topics: {
                        hiring: "Hiring / full-time role",
                        internship: "Internship opportunity",
                        collaboration: "Project collaboration",
                        freelance: "Freelance project",
                        other: "Other"
                    },
                    message_label: "Message",
                    message_placeholder: "Briefly describe the role, project, timeline, or next step...",
                    message_help: "Please include at least 20 characters. Avoid sharing sensitive information.",
                    send_btn: "Send Message",
                    sending: "Sending...",
                    sent: "Sent",
                    success: "Message sent. Thank you. I'll get back to you soon.",
                    error: "The message could not be sent. Please try again or use email instead.",
                    timeout: "The request took too long. Check your connection and try again.",
                    rate_limit: "Too many messages were submitted. Please wait a moment before trying again.",
                    validation_error: "Please review the highlighted fields and try again.",
                    privacy_prefix: "Your details are used only to respond. Submissions are processed by"
                }
            }
        }
    },
    id: {
        translation: {
            navbar: {
                home: "Beranda",
                about: "Tentang",
                projects: "Proyek",
                blog: "Blog",
                workspace: "Workspace",
                afk: "AFK",
                contact: "Kontak"
            },
            home: {
                highlights: "Sorotan Portofolio",
                featured_work: "Karya Pilihan",
                glimpse: "Beberapa proyek yang menunjukkan cara saya berpikir, membangun, dan menyelesaikan masalah.",
                view_details: "Lihat Detail →",
                view_all: "Lihat Semua Proyek",
                latest_blog: "Terbaru dari Blog",
                blog_glimpse: "Pemikiran tentang pengembangan web, aplikasi mobile, dan proses belajar.",
                view_all_blogs: "Lihat Semua Blog",
                afk_teaser: {
                    eyebrow: "Di Luar Coding",
                    title: "Sekilas tentang sisi saya di luar coding",
                    desc: "Lihat apa yang saya dengar, mainkan, dan tonton. Di sana saya mengisi ulang energi dan sering menemukan ide baru.",
                    cta: "Buka /afk"
                },
                beyond: {
                    eyebrow: "Di Luar Coding",
                    title: "Sedikit cerita di luar riwayat commit",
                    subtitle: "Sekilas tentang musik yang sedang sering diputar dan tempat saya berkarya.",
                    view_afk: "Jelajahi sisi /afk saya",
                    music_label: "Sedang Sering Diputar",
                    music_period: "Favorit dalam enam bulan terakhir",
                    refresh: "Perbarui lagu dari Spotify",
                    refreshing: "Memperbarui lagu dari Spotify",
                    loaded: "Lagu Spotify sudah siap",
                    open_spotify: "Buka di Spotify",
                    play_track: "Putar {{title}}",
                    player_ready: "Siap diputar",
                    player_title: "Pemutar Spotify",
                    close_player: "Tutup pemutar",
                    location_label: "Berdomisili di",
                    location: "Jakarta, Indonesia",
                    availability: "Terbuka untuk peluang remote dan berbasis di Jakarta",
                    contact: "Mulai percakapan"
                },
                recruiter_lens: {
                    eyebrow: "Sudut Pandang Rekruter",
                    control_label: "Pilih fokus portofolio",
                    copy_link: "Salin tautan yang dapat dibagikan untuk fokus ini",
                    link_copied: "Tautan portofolio terfokus berhasil disalin",
                    copy_error: "Tautan portofolio terfokus tidak dapat disalin",
                    project_proof: "Bukti",
                    highlighting_technology: "Menyorot karya yang dibuat dengan {{technology}}",
                    clear_technology: "Hapus sorotan teknologi",
                    related_project: "Menggunakan {{technology}}",
                    living_stack: {
                        eyebrow: "Tech Stack Interaktif",
                        title: "Teknologi yang terhubung dengan karya nyata",
                        summary: "Pilih teknologi untuk melihat perannya dan menyorot proyek tempat saya menerapkannya.",
                        control_label: "Pilih teknologi untuk dijelajahi",
                        active_label: "Teknologi terpilih",
                        used_in: "Digunakan pada"
                    },
                    technologies: {
                        kotlin: {
                            role: "Bahasa utama untuk pengembangan Android native",
                            usage: "RestUP, Mandiri News, dan Planetku"
                        },
                        android_studio: {
                            role: "Lingkungan pengembangan untuk produk Android",
                            usage: "RestUP, Mandiri News, dan Planetku"
                        },
                        firebase: {
                            role: "Layanan autentikasi dan data produk",
                            usage: "RestUP, Planetku, dan portfolio ini"
                        },
                        gradle: {
                            role: "Alur build dan dependensi Android",
                            usage: "RestUP, Mandiri News, dan Planetku"
                        },
                        tensorflow: {
                            role: "Integrasi machine learning pada perangkat",
                            usage: "Klasifikasi sampah Planetku"
                        },
                        react: {
                            role: "Pengembangan front-end berbasis komponen",
                            usage: "Personal Portfolio dan Personal Notes"
                        },
                        javascript: {
                            role: "Logika interaktif untuk browser dan aplikasi",
                            usage: "Computer Crafter, Personal Portfolio, dan Personal Notes"
                        },
                        vite: {
                            role: "Pengembangan front-end dan build produksi cepat",
                            usage: "Personal Portfolio dan Personal Notes"
                        },
                        tailwind: {
                            role: "Implementasi sistem desain responsif",
                            usage: "Personal Portfolio"
                        },
                        php: {
                            role: "Logika kompatibilitas dan katalog pada server",
                            usage: "Computer Crafter"
                        },
                        mysql: {
                            role: "Katalog komponen dan spesifikasi relasional",
                            usage: "Computer Crafter"
                        },
                        python: {
                            role: "Eksperimen dan analisis machine learning",
                            usage: "RestUP dan Analisis Sentimen Deepseek"
                        },
                        scikit_learn: {
                            role: "Pelatihan dan evaluasi model klasik",
                            usage: "RestUP dan Analisis Sentimen Deepseek"
                        },
                        pandas: {
                            role: "Persiapan dataset dan alur analitik",
                            usage: "Analisis Sentimen Deepseek"
                        }
                    },
                    options: {
                        overview: "Ringkasan",
                        android: "Android",
                        frontend: "Front-End",
                        ai: "AI / ML"
                    },
                    modes: {
                        overview: {
                            title: "Cara terfokus untuk melihat karya saya",
                            summary: "Lihat profil lengkap atau pilih role untuk menampilkan proyek, stack, dan hasil yang paling relevan.",
                            tagline: "Lulusan Informatika yang membangun produk Android, front-end, dan integrasi AI yang praktis.",
                            focus: "Android, Front-End & AI",
                            stack: "Kotlin, React, Firebase",
                            hero_phrases: [
                                "produk Android yang praktis.",
                                "pengalaman web yang responsif.",
                                "fitur terintegrasi AI yang berguna."
                            ],
                            work_title: "Karya Pilihan",
                            work_summary: "Tiga proyek yang menunjukkan kepemilikan produk, rentang teknis, dan hasil terukur.",
                            seo_title: "Rafie Rojagat | Portofolio Software Engineer",
                            seo_desc: "Portofolio Rafie Rojagat Bachri, lulusan Informatika yang membangun produk Android, front-end, dan integrasi AI dengan Kotlin dan React.",
                            proof: [
                                { label: "Pendidikan", value: "Lulusan Informatika, IPK 3,89/4,00" },
                                { label: "Pengembangan", value: "Proyek mandiri dan tim beranggotakan 6 orang" },
                                { label: "Ketersediaan", value: "Terbuka untuk magang dan posisi entry-level" }
                            ]
                        },
                        android: {
                            title: "Pengembangan produk Android",
                            summary: "Karya Android native yang berfokus pada arsitektur andal, data asinkron, dan alur mobile siap produk.",
                            tagline: "Developer Android yang membangun produk Kotlin andal dengan data dan state terstruktur.",
                            focus: "Android Native",
                            stack: "Kotlin, MVVM, Coroutines",
                            hero_phrases: [
                                "aplikasi native dengan Kotlin.",
                                "alur data MVVM yang andal.",
                                "fitur Android yang responsif."
                            ],
                            work_title: "Karya Android Pilihan",
                            work_summary: "Proyek Android yang mencakup paginasi REST, alur Firebase, dan machine learning pada perangkat.",
                            seo_title: "Rafie Rojagat | Portofolio Developer Android",
                            seo_desc: "Portofolio developer Android dengan Kotlin, MVVM, Coroutines, Retrofit, Firebase, dan machine learning pada perangkat.",
                            proof: [
                                { label: "Stack utama", value: "Kotlin, MVVM, Retrofit, Coroutines" },
                                { label: "Bukti pengembangan", value: "Tiga studi kasus Android terperinci" },
                                { label: "Hasil terkuat", value: "Nilai proyek Mandiri 88,71/100" }
                            ]
                        },
                        frontend: {
                            title: "Pengembangan produk front-end dan web",
                            summary: "Antarmuka responsif yang didukung keputusan state, aksesibilitas, performa, dan integrasi data yang praktis.",
                            tagline: "Developer front-end yang membangun produk React responsif dan pengalaman web full-stack praktis.",
                            focus: "Front-End & Web",
                            stack: "React, Vite, Tailwind",
                            hero_phrases: [
                                "antarmuka React yang responsif.",
                                "interaksi web yang aksesibel.",
                                "sistem front-end yang terawat."
                            ],
                            work_title: "Karya Front-End Pilihan",
                            work_summary: "Proyek web yang mencakup aplikasi React, logika kompatibilitas, UI responsif, dan deployment nyata.",
                            seo_title: "Rafie Rojagat | Portofolio Developer Front-End",
                            seo_desc: "Portofolio developer front-end dengan React, Vite, Tailwind CSS, antarmuka responsif, dan produk web praktis.",
                            proof: [
                                { label: "Stack utama", value: "React, JavaScript, Vite, Tailwind CSS" },
                                { label: "Rentang produk", value: "UI responsif dan logika web full-stack" },
                                { label: "Bukti pengembangan", value: "Tiga studi kasus web terfokus" }
                            ]
                        },
                        ai: {
                            title: "AI dan machine learning terapan",
                            summary: "Evaluasi model yang dihubungkan ke pengalaman mobile dan produk yang mudah dipahami, bukan sekadar hasil notebook.",
                            tagline: "Developer AI terapan yang menghubungkan model teruji dengan pengalaman produk praktis.",
                            focus: "AI & ML Terapan",
                            stack: "Scikit-Learn, TFLite, OpenCV",
                            hero_phrases: [
                                "model machine learning teruji.",
                                "fitur AI pada perangkat.",
                                "keluaran AI yang mudah dipahami."
                            ],
                            work_title: "Karya AI & ML Pilihan",
                            work_summary: "Proyek ML terapan untuk klasifikasi kesehatan, visi pada perangkat, dan analisis sentimen.",
                            seo_title: "Rafie Rojagat | Portofolio Developer AI Terapan",
                            seo_desc: "Portofolio AI terapan dengan Scikit-Learn, TensorFlow Lite, OpenCV, evaluasi model, dan produk terintegrasi AI.",
                            proof: [
                                { label: "Evaluasi model", value: "Akurasi klasifikasi tidur 92,06%" },
                                { label: "AI pada perangkat", value: "Akurasi klasifikasi sampah 90%" },
                                { label: "Proyek NLP", value: "Akurasi model sentimen 87,67%" }
                            ]
                        }
                    }
                }
            },
            about: {
                title: "Tentang Saya",
                eyebrow: "Developer Mobile, Front-End & AI",
                headline: "Saya mengubah ide produk menjadi pengalaman Android dan web yang praktis.",
                summary: "Saya lulusan baru Informatika UPN Veteran Jakarta dengan IPK 3,89/4,00 yang berfokus pada pengembangan Android, front-end, dan integrasi AI.",
                summary_secondary: "Saya memadukan Kotlin, React.js, machine learning, Clean Architecture, dan MVVM untuk membangun produk yang berguna, mudah dirawat, dan sesuai kebutuhan pengguna.",
                location: "Jakarta Utara, Indonesia",
                availability: "Terbuka untuk magang dan posisi entry-level",
                view_projects: "Lihat Proyek",
                contact: "Hubungi Saya",
                snapshot: {
                    graduate: "Lulusan Informatika",
                    gpa: "IPK / 4,00",
                    mandiri: "Nilai proyek Mandiri",
                    ml_accuracy: "Akurasi model skripsi",
                    bangkit_hours: "Jam belajar Bangkit"
                },
                education: {
                    title: "Pendidikan",
                    subtitle: "Fondasi akademik di balik karya engineering saya.",
                    degree: "Sarjana Informatika",
                    note: "Berfokus pada software engineering, pengembangan Android, produk web, dan machine learning terapan.",
                    period: "Agu 2022 - Jul 2026"
                },
                profile_lab: {
                    title: "ID Developer",
                    subtitle: "Badge profil ringkas dengan pratinjau 3D ringan yang dapat dibuka bila diperlukan.",
                    show_profile: "Buka Kartu Profil",
                    hide_profile: "Tutup Kartu Profil",
                    show_3d: "Lihat Badge 3D",
                    hide_3d: "Tutup Badge 3D"
                },
                download_cv: "Unduh CV",
                hello: "Halo, saya",
                desc1: "Saya lulusan baru <1>Informatika</1> UPN “Veteran” Jakarta dengan ketertarikan kuat pada <3>Pengembangan Front-End dan Mobile</3>.",
                desc2: "Terampil membangun aplikasi responsif menggunakan <1>JavaScript</1>, <3>React</3>, dan <5>Kotlin</5>. Sangat termotivasi untuk meningkatkan keterampilan teknis melalui kesempatan magang guna menciptakan solusi digital yang berdampak.",
                card_label: "Kartu Profil",
                card_note: "Classic Card ditampilkan secara default agar alur baca lebih rapi.",
                card_show_3d: "Tampilkan Pratinjau 3D",
                card_hide_3d: "Sembunyikan Pratinjau 3D",
                card_preview_hint: "Geser untuk berinteraksi. Pratinjau ini masih eksperimental.",
                card_loading_3d: "Memuat pratinjau 3D interaktif...",
                edu_title: "Pendidikan",
                uni_name: "Universitas Pembangunan Nasional \"Veteran\" Jakarta",
                uni_major: "Informatika (2022 - 2026)",
                hs_name: "SMA Negeri 13 Jakarta",
                hs_major: "IPA (2019 - 2022)"
            },
            hero: {
                greeting: "Halo, saya",
                tagline: "Lulusan baru Informatika yang membangun produk mobile dan web praktis dengan React dan Kotlin.",
                typewriter_prefix: "Saya membangun",
                role_phrases: [
                    "aplikasi mobile yang praktis.",
                    "pengalaman web yang responsif.",
                    "produk dengan React dan Kotlin."
                ],
                view_work: "Tentang Saya",
                view_projects: "Lihat Proyek",
                download_cv: "Unduh CV",
                contact_me: "Mari Terhubung",
                afk_cta: {
                    prefix: "Ingin lihat sisi saya di luar coding?",
                    link: "Kunjungi /afk"
                },
                quick_facts: {
                    location: "Jakarta, Indonesia",
                    availability: "Terbuka untuk peluang kerja",
                    focus: "Mobile dan Web",
                    stack: "React, Kotlin, Firebase"
                }
            },
            footer: {
                description: "Membangun pengalaman digital dengan kode dan kreativitas. Mari ciptakan sesuatu yang luar biasa bersama.",
                quick_links: "Tautan Cepat",
                connect: "Terhubung",
                download_cv: "Unduh CV",
                rights: "Hak cipta dilindungi.",
                made_with: "Dibuat dengan",
                and: "dan",
                in: "di"
            },
            experience: {
                eyebrow: "Pengalaman Terapan",
                title: "Pengalaman & Program Pilihan",
                subtitle: "Peran dan program terstruktur ketika saya mengembangkan software, memimpin pembelajaran teknis, dan mendampingi mahasiswa dengan hasil yang terukur.",
                docs: "Dokumentasi",
                view_docs: "Lihat dokumentasi",
                photo_count: "{{count}} foto",
                open_docs: "Buka dokumentasi {{title}}",
                gallery_label: "Galeri dokumentasi {{title}}",
                photo_alt: "Dokumentasi {{title}}, foto {{current}} dari {{total}}",
                close_gallery: "Tutup galeri",
                previous_photo: "Foto sebelumnya",
                next_photo: "Foto berikutnya"
            },
            skills: {
                eyebrow: "Kompetensi Utama",
                title: "Keahlian Teknis",
                description: "Ringkasan teknologi yang mudah dipindai rekruter, mencakup Android, web, AI, backend, dan workflow pengembangan.",
                categories: {
                    frontend: {
                        title: "Frontend Engineering",
                        desc: "Membangun antarmuka responsif, interaksi rapi, dan halaman React yang siap produksi."
                    },
                    mobile: {
                        title: "Mobile Android",
                        desc: "Membangun aplikasi Android native dengan UI modern, state terstruktur, dan integrasi API yang andal."
                    },
                    ai: {
                        title: "AI & Machine Learning",
                        desc: "Melatih model praktis serta mengintegrasikan generative AI ke dalam workflow pengembangan dan produk."
                    },
                    backend: {
                        title: "Backend & Data",
                        desc: "Mengelola API, database, autentikasi, dan workflow aplikasi berbasis cloud."
                    },
                    tools: {
                        title: "Tools & Workflow",
                        desc: "Mendesain, versioning, debugging, dan merilis proyek dengan toolchain yang stabil."
                    }
                }
            },
            certifications: {
                eyebrow: "Pelatihan & Kredensial",
                title: "Sertifikasi Pilihan",
                subtitle: "Sorotan dari CV dan kredensial teknis lama yang relevan ditampilkan lebih dulu. Arsip lengkap tetap tersedia tanpa carousel otomatis.",
                issued: "Diterbitkan",
                verify: "Verifikasi Sertifikat",
                view_all: "Lihat semua {{count}} kredensial",
                show_selected: "Tampilkan pilihan saja",
                preview: "Pratinjau sertifikat {{title}}",
                close_preview: "Tutup pratinjau sertifikat",
                general: "Umum"
            },
            projects: {
                title: "Proyek Unggulan",
                featured_eyebrow: "Karya Pilihan",
                featured_title: "Studi Kasus Unggulan",
                featured_desc: "Lima proyek pilihan berdasarkan cakupan produk, tanggung jawab teknis, dan hasil yang terukur.",
                archive_eyebrow: "Karya Lainnya",
                archive_title: "Arsip Proyek",
                archive_desc: "Eksperimen, proyek kuliah, karya desain, dan proyek kecil yang dikelompokkan agar mudah dipindai.",
                search_results: "Jelajahi Proyek",
                results_title: "Hasil Proyek",
                project_count: "{{count}} proyek sesuai dengan pencarian dan filter saat ini.",
                subtitle: "Repositori GitHub Terbaru",
                subtitle_desc: "Ringkasan kecil aktivitas kode publik yang hanya dimuat saat dibutuhkan.",
                github_eyebrow: "Aktivitas Kode",
                view_details: "Lihat Detail",
                case_study: "Lihat Studi Kasus",
                live_site: "Lihat Situs",
                design: "Lihat Desain",
                prototype: "Coba Prototipe",
                source_code: "Kode Sumber",
                conceptual_cover: "Cover konseptual",
                no_projects: "Tidak ada proyek ditemukan.",
                loading: "Memuat...",
                search_placeholder: "Cari nama, teknologi, atau kata kunci",
                clear_search: "Hapus pencarian proyek",
                filter_label: "Filter proyek berdasarkan bidang",
                show_all: "Tampilkan semua {{count}} proyek",
                show_less: "Tampilkan lebih sedikit",
                view_github: "Lihat Profil GitHub",
                open_repository: "Buka repositori",
                no_repo_description: "Belum ada deskripsi repositori.",
                github_error: "Repositori terbaru belum dapat dimuat saat ini.",
                github_empty: "Tidak ada repositori publik yang ditemukan.",
                filter: {
                    all: "Semua",
                    mobile: "Aplikasi Mobile",
                    web: "Aplikasi Web",
                    ai: "AI & Data",
                    python: "Python",
                    java: "Java",
                    ui: "UI/UX",
                    flutter: "Flutter",
                    game: "Game",
                    other: "Lainnya"
                },
                seo_title: "Proyek | Rafie Rojagat",
                seo_desc: "Studi kasus Android, web, dan AI pilihan Rafie Rojagat, termasuk peran, keputusan teknis, dan hasil terukur."
            },
            projectDetail: {
                category_label: "Proyek",
                impact: {
                    eyebrow: "Ringkasan Rekruter",
                    title: "Selected Impact",
                    desc: "Ringkasan cepat tentang peran saya, kebutuhan proyek, dan tautan untuk mengecek hasilnya.",
                    role: "Peran",
                    team: "Tim",
                    result: "Hasil",
                    scope: "Cakupan",
                    tech_link: "Tech & Link",
                    team_fallback: "Proyek mandiri atau tim"
                },
                decision_replay: {
                    eyebrow: "Pertimbangan Engineering",
                    title: "Jejak Keputusan",
                    desc: "Telusuri constraint, alternatif, keputusan, dan bukti di balik produk yang selesai dikembangkan.",
                    controls: "Jelajahi langkah keputusan engineering",
                    step_count: "Langkah {{current}} dari {{total}}",
                    steps: {
                        problem: "Masalah",
                        constraint: "Constraint",
                        options: "Alternatif",
                        decision: "Keputusan",
                        tradeoff: "Trade-off",
                        evidence: "Bukti"
                    }
                },
                overview: "Ringkasan Proyek",
                features: "Fitur Utama",
                tech_used: "Teknologi yang Digunakan",
                challenge: "Tantangan",
                solution: "Solusi",
                learned: "Pelajaran yang Didapat",
                gallery: "Galeri Proyek",
                conceptual_cover: "Ini adalah cover konseptual untuk presentasi portofolio, bukan screenshot final produk.",
                click_close: "Klik di luar atau tekan Esc untuk menutup"
            },
            workspace: {
                seo_title: "Workspace & Tools Pengembangan | Rafie Rojagat",
                seo_desc: "Perangkat, tools pengembangan, dan workflow praktis yang digunakan Rafie Rojagat untuk merancang, membangun, menguji, dan merilis produk Android serta web.",
                eyebrow: "Setup Utama",
                title_prefix: "Tools di balik",
                title_highlight: "setiap karya.",
                subtitle: "Gambaran praktis tentang perangkat dan software yang saya gunakan untuk mengubah ide menjadi produk Android atau web yang telah diuji.",
                updated: "Terakhir diperbarui: Agustus 2026",
                workflow: {
                    eyebrow: "Cara Kerja",
                    title: "Alur sederhana dari ide hingga rilis",
                    subtitle: "Tools paling berguna ketika mendukung cara kerja yang jelas dan dapat diulang.",
                    plan: {
                        title: "Rencana & Prototipe",
                        desc: "Memperjelas requirement, meriset masalah, dan menyusun alur antarmuka sebelum implementasi."
                    },
                    build: {
                        title: "Bangun & Integrasikan",
                        desc: "Mengimplementasikan fitur Android atau web, menghubungkan data, dan menjaga arsitektur tetap terawat."
                    },
                    validate: {
                        title: "Uji & Rilis",
                        desc: "Memvalidasi API dan perilaku perangkat nyata, meninjau perubahan, lalu menyiapkan rilis yang andal."
                    }
                },
                stack: {
                    eyebrow: "Stack Saat Ini",
                    title: "Perangkat dan tools",
                    subtitle: "Setup terfokus untuk pekerjaan produk, bukan daftar lengkap setiap aplikasi yang pernah saya coba.",
                    count: "{{count}} item",
                    filter_label: "Filter item workspace berdasarkan kategori"
                },
                groups: {
                    all: "Semua",
                    hardware: "Perangkat",
                    development: "Pengembangan",
                    design_productivity: "Desain & Produktivitas",
                    testing_delivery: "Pengujian & Delivery"
                },
                view_details: "Lihat detail",
                open_details: "Buka detail {{title}}",
                close_preview: "Tutup detail workspace",
                purpose: "Cara saya menggunakannya",
                official_site: "Situs resmi",
                product_page: "Halaman produk",
                github_profile: "Profil GitHub"
            },
            pages: {
                projects: {
                    title_prefix: "Proyek",
                    title_highlight: "Saya",
                    subtitle: "Karya Android, web, dan AI pilihan yang menjelaskan masalah, keputusan, serta hasil di balik proses pembuatannya."
                },
                about: {
                    title_prefix: "Tentang",
                    title_highlight: "Rafie",
                    subtitle: "Lulusan baru Informatika yang membangun produk Android, front-end, dan terintegrasi AI dengan fokus pada hasil praktis."
                },
                blog: {
                    seo_title: "Catatan Engineering & Studi Kasus | Rafie Rojagat",
                    seo_desc: "Studi kasus Android, web, machine learning, dan pengalaman mengajar oleh Rafie Rojagat Bachri.",
                    eyebrow: "Tulisan & Studi Kasus",
                    title_prefix: "Catatan",
                    title_highlight: "Engineering.",
                    subtitle: "Catatan praktis tentang membangun produk Android, web, dan terintegrasi AI, beserta pembelajaran saat mengajar topik teknis.",
                    featured_eyebrow: "Studi Kasus Pilihan",
                    featured_badge: "Pilihan",
                    recent_eyebrow: "Jelajahi Arsip",
                    recent_title: "Tulisan terbaru",
                    recent_subtitle: "Studi kasus, catatan implementasi, dan sesi belajar CodeVox.",
                    search_label: "Cari artikel",
                    search_placeholder: "Cari artikel...",
                    clear_search: "Hapus pencarian",
                    filter_label: "Filter artikel berdasarkan topik",
                    categories: {
                        all: "Semua",
                        "case-study": "Studi Kasus",
                        android: "Android",
                        web: "Web",
                        learning: "Pembelajaran"
                    },
                    article_count_one: "{{count}} artikel",
                    article_count_other: "{{count}} artikel",
                    read_time_one: "{{count}} menit baca",
                    read_time_other: "{{count}} menit baca",
                    read_article: "Baca artikel",
                    empty_title: "Artikel tidak ditemukan",
                    empty_desc: "Coba kata kunci atau topik lain.",
                    back: "Kembali ke Blog",
                    published: "Terbit",
                    updated: "Diperbarui",
                    share: "Bagikan artikel",
                    copied: "Tautan disalin",
                    impact_eyebrow: "Dampak Pilihan",
                    role: "Peran",
                    team: "Tim",
                    result: "Hasil",
                    scope: "Cakupan",
                    video_eyebrow: "Rekaman Sesi",
                    play_video: "Putar video",
                    video_note: "Pemutar YouTube baru dimuat setelah Anda memilih untuk memutarnya.",
                    open_project: "Lihat detail proyek",
                    related_eyebrow: "Lanjut Membaca",
                    related_title: "Artikel terkait"
                },
                contact: {
                    eyebrow: "Terbuka untuk Peluang",
                    title_prefix: "Mari membangun",
                    title_highlight: "sesuatu yang berguna.",
                    subtitle: "Saya terbuka untuk peluang Android, front-end, dan software terintegrasi AI. Ceritakan posisi atau produk yang sedang Anda kembangkan."
                }
            },
            afk: {
                subtitle: "Jauh Dari Keyboard.",
                seo_desc: "Game, Musik, dan Film.",
                intro_line1: "Halaman ini berisi ritme saya di luar coding, dari musik yang sedang diputar sampai game dan film yang lagi saya nikmati.",
                intro_line2: "Buat saya, momen AFK ini justru sering jadi sumber ide saat balik ngoding.",
                afk_snapshot: {
                    title: "Sekilas aktivitas saya",
                    label: "Saat Ini",
                    musik: { label: "Musik", desc: "Playlist santai / fokus" },
                    game: { label: "Game", desc: "Steam + game kecil" },
                    film: { label: "Film", desc: "Rekomendasi & watchlist" }
                },
                music_note: "Playlist yang biasa saya putar untuk beristirahat, fokus, atau mencari ritme sebelum kembali berkarya.",
                cinema_note: "Catatan ringkas tentang cerita yang membekas bagi saya, bukan seluruh riwayat tontonan.",
                watchlist_note: "Antrean singkat film yang ingin saya luangkan waktu untuk tonton berikutnya.",
                playful_break: "Jeda bermain",
                currently_live: "Live dari Discord",
                films: "film",
                no_movies: "Belum ada pilihan film yang dapat ditampilkan saat ini.",
                no_score: "Belum ada skor",
                show_archive: "Tampilkan {{count}} tahun lainnya",
                hide_archive: "Tutup arsip",
                open_spotify: "Buka di Spotify",
                close_player: "Tutup pemutar",
                spotify_ranges: {
                    four_weeks: "4 minggu",
                    six_months: "6 bulan",
                    all_time: "Semua waktu"
                },
                play_track: "Putar",
                spotify_status: {
                    now_playing: "Sedang diputar",
                    last_played: "Terakhir diputar",
                    not_playing: "Tidak ada lagu yang sedang diputar.",
                    unavailable: "Data Spotify belum dapat dimuat saat ini.",
                    no_tracks: "Belum ada lagu yang ditemukan."
                },
                reaction_game: {
                    title: "Waktu Reaksi",
                    subtitle: "Klik saat tombol berubah warna. Semakin kecil nilainya, semakin cepat refleksmu.",
                    status: "Status",
                    best: "Terbaik",
                    last: "Terakhir",
                    start_btn: "Mulai",
                    waiting_btn: "Jangan klik dulu",
                    go_btn: "KLIK SEKARANG!",
                    retry_btn: "Coba Lagi",
                    restart_btn: "Mulai Ulang",
                    reset_btn: "Reset",
                    status_ready: "Siap",
                    status_wait: "Tunggu",
                    status_go: "Gas!",
                    status_result: "Hasil",
                    message_ready: "Tekan mulai, lalu klik saat tombol berubah warna.",
                    message_wait: "Siap... tunggu tombol berubah warna.",
                    message_go: "Sekarang! Klik secepat mungkin.",
                    message_early: "Terlalu cepat. Coba lagi dan tunggu warna berubah.",
                    message_saved: "Skor berhasil disimpan ke Firebase.",
                    leaderboard: {
                        title: "Top 5 Skor",
                        empty: "Belum ada skor. Coba main sekali dulu.",
                        desc: "Skor refleks",
                        gold: "Emas",
                        silver: "Perak",
                        bronze: "Perunggu",
                        champion: "Juara 1"
                    }
                },
                status_check: "Cek Status",
                playing: "Sedang Main",
                offline: "Offline",
                chilling: "Sedang santai...",
                on_repeat: "Sedang Diputar",
                top_tracks: "Lagu Teratas Bulan Ini",
                recent_games: "Baru Saja Dimainkan",
                no_recent_games: "Tidak ada aktivitas terbaru.",
                cinema_log: "Catatan Film",
                want_to_watch: "Ingin Ditonton",
                no_watchlist: "Belum ada watchlist.",
                now_in_cinema: "Now in Cinema",
                no_now_in_cinema: "Data bioskop belum tersedia saat ini.",
                rafie_picks: "Pilihan Rafie",
                curated_pick: "Pilihan Kurasi",
                no_rafie_picks: "Belum ada pilihan kurasi.",
                best_year: "Terbaik Tahun Ini",
                steam_library: "Perpustakaan Steam",
                hours: "jam total",
                view_library: "Lihat Semua",
                spotify: "Spotify Saya",
                now_playing: "Sedang Diputar"
            },
            chatbot: {
                title: "Asisten Rafie",
                status: "Panduan portofolio",
                open: "Buka Asisten Rafie",
                close: "Tutup Asisten Rafie",
                reset: "Mulai percakapan baru",
                welcome: "Halo, saya asisten portofolio Rafie. Tanyakan proyek, pengalaman, keahlian, atau ketersediaannya.",
                quick_ask: "Pertanyaan cepat",
                input_label: "Kirim pesan ke asisten portofolio Rafie",
                placeholder: "Tanyakan karya Rafie...",
                send: "Kirim pesan",
                loading: "Sedang berpikir...",
                retry: "Coba lagi",
                privacy: "Jawaban AI mungkin tidak selalu sempurna. Pesan diproses oleh Google Gemini; jangan bagikan informasi sensitif.",
                suggestions: {
                    experience: {
                        label: "Pengalaman",
                        prompt: "Bagaimana pengalaman profesional dan program yang pernah diikuti Rafie?"
                    },
                    impact: {
                        label: "Dampak proyek",
                        prompt: "Proyek Rafie mana yang memiliki dampak terukur paling kuat?"
                    },
                    stack: {
                        label: "Tech stack",
                        prompt: "Teknologi dan kemampuan engineering apa yang digunakan Rafie?"
                    },
                    availability: {
                        label: "Ketersediaan",
                        prompt: "Apakah Rafie tersedia untuk rekrutmen, magang, atau kolaborasi?"
                    }
                },
                actions: {
                    projects: "Lihat proyek",
                    about: "Lihat pengalaman",
                    workspace: "Lihat stack",
                    contact: "Hubungi Rafie",
                    cv: "Unduh CV"
                },
                errors: {
                    generic: "Asisten belum dapat dihubungi saat ini. Silakan coba lagi.",
                    timeout: "Respons terlalu lama. Periksa koneksi Anda lalu coba kembali.",
                    rate_limit: "Anda mengirim beberapa pesan terlalu cepat. Tunggu satu menit lalu coba kembali.",
                    invalid: "Pesan tersebut belum dapat diproses. Persingkat pesan lalu coba lagi.",
                    unavailable: "Asisten sedang tidak tersedia. Anda tetap dapat menggunakan halaman Kontak."
                }
            },
            contact: {
                seo_title: "Kontak | Rafie Rojagat",
                seo_desc: "Hubungi Rafie Rojagat untuk peluang software Android, front-end, integrasi AI, magang, dan kolaborasi.",
                title: "Hubungi Saya",
                subtitle: "Saya terbuka untuk mendiskusikan posisi software, kolaborasi, dan produk praktis.",
                availability_label: "Ketersediaan saat ini",
                availability: "Terbuka untuk posisi entry-level, magang, dan kolaborasi",
                info_title: "Detail kontak",
                location: "Lokasi",
                response_time_label: "Waktu respons",
                response_time: "Biasanya dalam 1-2 hari kerja",
                copy_email: "Salin alamat email",
                email_copied: "Alamat email tersalin",
                download_cv: "Unduh CV",
                profiles: "Profil lainnya",
                open_profile: "Buka",
                form: {
                    eyebrow: "Mulai percakapan",
                    title: "Ceritakan peluangnya",
                    subtitle: "Bagikan posisi, proyek, atau masalah yang ingin dibahas. Sedikit konteks akan membantu saya memberi respons yang relevan.",
                    name_label: "Nama",
                    name_placeholder: "Masukkan nama lengkap Anda",
                    email_label: "Email",
                    email_placeholder: "Masukkan alamat email Anda",
                    topic_label: "Topik",
                    topic_placeholder: "Pilih alasan menghubungi",
                    topics: {
                        hiring: "Rekrutmen / posisi penuh waktu",
                        internship: "Peluang magang",
                        collaboration: "Kolaborasi proyek",
                        freelance: "Proyek freelance",
                        other: "Lainnya"
                    },
                    message_label: "Pesan",
                    message_placeholder: "Jelaskan singkat posisi, proyek, linimasa, atau langkah berikutnya...",
                    message_help: "Gunakan minimal 20 karakter. Hindari membagikan informasi sensitif.",
                    send_btn: "Kirim Pesan",
                    sending: "Mengirim...",
                    sent: "Terkirim",
                    success: "Pesan berhasil dikirim. Terima kasih, saya akan segera membalas.",
                    error: "Pesan belum dapat dikirim. Silakan coba lagi atau gunakan email.",
                    timeout: "Permintaan terlalu lama. Periksa koneksi Anda lalu coba kembali.",
                    rate_limit: "Terlalu banyak pesan dikirim. Tunggu sebentar sebelum mencoba kembali.",
                    validation_error: "Periksa kolom yang ditandai lalu coba kembali.",
                    privacy_prefix: "Detail Anda hanya digunakan untuk membalas. Pengiriman diproses oleh"
                }
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
