const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

// Full Course Catalog with Rich Details, Sneak Peeks, Key Points & Instructors
const COURSES_CATALOG = [
    {
        id: 'figma',
        title: 'Learn Figma from Basic',
        author: 'purepearl studio',
        category: 'UI/UX Design',
        tags: ['Featured', 'UI/UX Design', 'Design'],
        level: 'Beginner',
        rating: 4.8,
        ratingCount: 240,
        reviewsCount: 172,
        studentsCount: 1200,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        price: 25,
        image: '/figma-images/course_1_wireframe.jpg',
        subtitle: 'Master modern UI/UX design workflows from wireframes to interactive prototypes',
        description: 'Embark on an enlightening exploration into Figma. Learn foundational interface tools, component architecture, auto layout, and responsive layouts to jumpstart your career in product design.',
        descriptionParagraphs: [
            'Embark on an enlightening exploration into the world of digital product design with "Learn Figma from Basic." This comprehensive course invites you to master the leading industry tool for user interface and experience design. From laying the groundwork with fundamental interface tools to creating polished interactive components, this guide is meticulously curated to empower you with essential modern design skills.',
            'In the initial modules, you will establish a solid foundation by immersing yourself in frames, vector networks, typography tokens, and responsive constraints. Understand the core principles of atomic design and gain proficiency in leveraging nested auto-layout structures to design interfaces that fluidly adapt across any mobile or desktop screen size.',
            'As you progress through the course, you will ascend to higher levels of expertise, delving into component variants, interactive component states, and smart animate prototypes. Uncover developer handoff secrets, export pixel-perfect design specifications, and engage in hands-on exercises that reinforce your real-world portfolio.'
        ],
        sneakPeek: [
            '/figma-images/a7c9406fd05787fc6c03edf5db05f212b96366a6.jpg',
            '/figma-images/d443b5217bfd460249d4ac0712aa129bc29a8919.jpg',
            '/figma-images/2e1b62a2460ffba94cc633550f3a06e03b29b432.jpg',
            '/figma-images/0c1762672f5c64aa67de3991c2ac4aa729328623.jpg'
        ],
        keyPoints: [
            'Figma Workspace & Vector Tools Mastery',
            'Auto Layout 5.0 & Responsive Constraints',
            'Design Tokens, Typography & Color Systems',
            'Components, Variants & State Machine',
            'Smart Animate Prototyping & Micro-interactions',
            'Design System Handoff & Developer Specs'
        ],
        instructor: {
            name: 'PurePearl Studio',
            role: 'Professional Creator',
            avatar: '/figma-images/bfd09b20f2cf44bfa3af771f6396363d4ae67aab.jpg',
            bio: 'Leading UI/UX design collective creating world-class web and mobile systems for millions of global learners.'
        },
        lessons: [
            { number: '01', title: 'Introduction to Figma & Workspace', duration: '12 mins' },
            { number: '02', title: 'Frames, Shapes & Vector Networks', duration: '18 mins' },
            { number: '03', title: 'Typography & Color Tokens', duration: '15 mins' },
            { number: '04', title: 'Auto Layout Mastery', duration: '24 mins' },
            { number: '05', title: 'Components, Variants & Design Systems', duration: '28 mins' },
            { number: '06', title: 'Interactive Prototyping & Smart Animate', duration: '22 mins' },
            { number: '07', title: 'Developer Handoff & Exporting Assets', duration: '17 mins' }
        ]
    },
    {
        id: 'digital-asset',
        title: 'Build Digital Asset',
        author: 'purepearl studio',
        category: 'Drawing & Painting',
        tags: ['Featured', 'Drawing & Painting', 'UI/UX Design', 'Creative Marketing', 'Design'],
        level: 'Beginner',
        rating: 4.8,
        ratingCount: 310,
        reviewsCount: 215,
        studentsCount: 1450,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        price: 25,
        image: '/figma-images/course_2_icons.jpg',
        subtitle: 'Unlock the Power of Digital Creation with Expert Guidance',
        description: 'Learn how to conceptualize, design, package, and monetize high-value digital assets. From icon packs to template kits, build assets that generate passive revenue.',
        descriptionParagraphs: [
            'Embark on an enlightening exploration into the world of digital creation with our comprehensive course, "Build Digital Assets: A Comprehensive Guide." This transformative learning experience invites you to delve deep into the intricacies of crafting impactful digital content. From laying the groundwork with foundational concepts to mastering advanced techniques, this guide is meticulously curated to empower you with the skills essential for navigating the dynamic landscape of digital asset creation.',
            'In the initial modules, you\'ll establish a solid foundation by immersing yourself in the foundational concepts that form the backbone of digital asset creation. Understand the fundamental elements that constitute compelling digital content and gain proficiency in leveraging these elements to communicate effectively in the digital realm.',
            'As you progress through the course, you\'ll ascend to higher levels of expertise, delving into the nuances of design principles that drive impactful creations. Uncover the secrets behind effective visual communication, exploring color theory, typography, and layout strategies that elevate your digital assets to new heights. Engage in hands-on exercises that reinforce your understanding, allowing you to apply these principles in practical scenarios.'
        ],
        sneakPeek: [
            '/figma-images/a7c9406fd05787fc6c03edf5db05f212b96366a6.jpg',
            '/figma-images/d443b5217bfd460249d4ac0712aa129bc29a8919.jpg',
            '/figma-images/2e1b62a2460ffba94cc633550f3a06e03b29b432.jpg',
            '/figma-images/0c1762672f5c64aa67de3991c2ac4aa729328623.jpg'
        ],
        keyPoints: [
            'Foundational Concepts',
            'Design Principles Mastery',
            'Advanced Techniques in Digital Creation',
            'Project Showcase and Critique',
            'Optimizing for Various Platforms',
            'Digital Asset Management Best Practices'
        ],
        instructor: {
            name: 'PurePearl Studio',
            role: 'Professional Creator',
            avatar: '/figma-images/bfd09b20f2cf44bfa3af771f6396363d4ae67aab.jpg',
            bio: 'Elite digital creator collective specializing in iconic design libraries, commercial asset packs, and high-performance branding.'
        },
        lessons: [
            { number: '01', title: 'Introduction to Digital Assets', duration: '12 mins' },
            { number: '02', title: 'Design Principles for High Impact', duration: '21 mins' },
            { number: '03', title: 'Advanced Vector Styling & Optimization', duration: '16 mins' },
            { number: '04', title: 'Packaging for Marketplaces & Creators', duration: '25 mins' },
            { number: '05', title: 'Licensing, Pricing & Publishing', duration: '19 mins' }
        ]
    },
    {
        id: 'big-data',
        title: 'the Power of Big Data',
        author: 'purepearl studio',
        category: 'Animation',
        tags: ['Featured', 'Animation', 'Marketing', 'IT & Software'],
        level: 'Beginner',
        rating: 4.6,
        ratingCount: 180,
        reviewsCount: 98,
        studentsCount: 920,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        price: 25,
        image: '/figma-images/course_3_charts.jpg',
        subtitle: 'Explore real-world big data architectures, analytics, and business insights',
        description: 'Understand massive datasets, distributed streaming pipelines, cloud databases, and modern business analytics tools like never before.',
        descriptionParagraphs: [
            'Step into the high-velocity frontier of data science with "The Power of Big Data." This intensive course unravels the mystery behind processing terabytes of data with sub-second latency, providing you with real-world architecture patterns used by Fortune 500 tech leaders.',
            'Beginning with foundational distributed computing concepts, you will uncover how Hadoop, Apache Spark, and cloud lakehouses efficiently distribute complex computational workloads. Learn the fundamentals of cluster scaling, partitioning strategies, and fault-tolerant data storage.',
            'In the advanced sections, delve into real-time streaming architectures using Kafka, SQL analytics optimization, and dynamic visualization dashboards. Gain hands-on practice translating raw numbers into executive-level KPIs and automated predictive insights.'
        ],
        sneakPeek: [
            '/figma-images/course_3_charts.jpg',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'
        ],
        keyPoints: [
            'Distributed Big Data Systems & Scalable Storage',
            'Real-time Streaming Pipelines & Event Handling',
            'Modern Cloud Data Warehouses & Lakehouses',
            'High-Performance SQL & Query Optimization',
            'Data Visualization & Executive KPI Dashboards',
            'Machine Learning Integration & Predictive Models'
        ],
        instructor: {
            name: 'Dr. Marcus Vance',
            role: 'Principal Data Architect',
            avatar: '/figma-images/avatar_james_l.png',
            bio: 'Distinguished cloud architect and big data researcher with 12+ years designing mission-critical analytics clusters.'
        },
        lessons: [
            { number: '01', title: 'Fundamentals of Big Data Ecosystem', duration: '14 mins' },
            { number: '02', title: 'Distributed Storage & Processing Basics', duration: '20 mins' },
            { number: '03', title: 'ETL Pipelines & Data Warehouses', duration: '22 mins' },
            { number: '04', title: 'Interactive Analytics & Dashboards', duration: '18 mins' }
        ]
    },
    {
        id: 'productivity',
        title: 'Balancing Productivity and Life',
        author: 'purepearl studio',
        category: 'Social Media',
        tags: ['Featured', 'Social Media', 'Marketing', 'Business'],
        level: 'Beginner',
        rating: 4.7,
        ratingCount: 220,
        reviewsCount: 140,
        studentsCount: 1100,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        price: 25,
        image: '/figma-images/course_4_domore.jpg',
        subtitle: 'Supercharge your daily workflow, mindfulness and peak creative performance',
        description: 'Optimize your daily schedule, establish high-focus deep work blocks, eliminate digital fatigue, and achieve harmony between output and personal wellbeing.',
        descriptionParagraphs: [
            'Reclaim control over your time and mental energy with "Balancing Productivity and Life." Designed specifically for ambitious creatives and knowledge workers, this course breaks free from hustle culture to deliver sustainable, scientifically proven high-performance workflows.',
            'Discover how to design distraction-free work environments, master time-blocking rituals, and align tasks with your natural circadian focus peaks. You will audit daily friction points and systematically eliminate context switching and digital fatigue.',
            'Through guided weekly experiments, build customized morning and wind-down routines that rejuvenate your creativity. Achieve deep peace of mind knowing your professional goals and personal health exist in effortless, productive synergy.'
        ],
        sneakPeek: [
            '/figma-images/course_4_domore.jpg',
            'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80'
        ],
        keyPoints: [
            'Circadian Energy Mapping & Peak Focus Windows',
            'Deep Work Architecture & Distraction Immunity',
            'Digital Minimalism & Inbox Zero Automation',
            'Sustainable Habit Stacking & Daily Rituals',
            'Burnout Prevention & Rest Recovery Protocols',
            'Quarterly Life Audits & Long-term Goal Realization'
        ],
        instructor: {
            name: 'Elena Rostova',
            role: 'Mindset & Performance Coach',
            avatar: '/figma-images/71d7929ee0ecb2198c9955a8e842f4991dcb4655.jpg',
            bio: 'Author and executive performance strategist helping modern creators achieve effortless daily focus and balance.'
        },
        lessons: [
            { number: '01', title: 'Modern Workspace Architecture', duration: '10 mins' },
            { number: '02', title: 'Deep Work Mastery & Focus Rituals', duration: '16 mins' },
            { number: '03', title: 'Managing Complex Multi-File Projects', duration: '25 mins' },
            { number: '04', title: 'Burnout Prevention & Habit Loops', duration: '19 mins' }
        ]
    },
    {
        id: 'money',
        title: 'Mastering Money Management',
        author: 'purepearl studio',
        category: 'Marketing',
        tags: ['Featured', 'Marketing', 'Creative Marketing', 'Business'],
        level: 'Beginner',
        rating: 4.8,
        ratingCount: 260,
        reviewsCount: 180,
        studentsCount: 1340,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        price: 25,
        image: '/figma-images/course_5_graph.jpg',
        subtitle: 'Data-driven financial modeling, growth tracking, and modern investing',
        description: 'Learn budgeting metrics, financial forecasting models, cash flow visualization, and strategic investments for creative professionals and entrepreneurs.',
        descriptionParagraphs: [
            'Take definitive charge of your financial future with "Mastering Money Management." Whether you are scaling a creative business or optimizing personal wealth, this course delivers a masterclass in modern asset allocation, cash flow optimization, and compound growth.',
            'We begin by deconstructing personal balance sheets, tax efficiency strategies, and liquid emergency cushions. Learn how to track recurring overhead with automated spreadsheets, eliminate unnecessary capital drag, and safeguard your financial security.',
            'Next, explore institutional-grade investment frameworks—including low-cost global index funds, real estate trusts, and intelligent rebalancing models. Build a resilient wealth engine that operates quietly and steadily in the background of your life.'
        ],
        sneakPeek: [
            '/figma-images/course_5_graph.jpg',
            'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80'
        ],
        keyPoints: [
            'Personal Balance Sheet & Cash Flow Mastery',
            'Automated High-Yield Savings & Expense Allocations',
            'Index Fund Investing & Compound Growth Secrets',
            'Tax-Advantaged Accounts & Retirement Planning',
            'Risk Mitigation & Inflation Hedging Tactics',
            'Building Resilient Multi-Stream Passive Income'
        ],
        instructor: {
            name: 'Julian Thorne',
            role: 'Senior Financial Strategist',
            avatar: '/figma-images/avatar_alex_b.png',
            bio: 'Chartered wealth advisor and financial modeler specializing in investment portfolios for modern founders.'
        },
        lessons: [
            { number: '01', title: 'Principles of Financial Forecasting', duration: '15 mins' },
            { number: '02', title: 'Tracking Revenue Streams & Margins', duration: '22 mins' },
            { number: '03', title: 'Interpreting Balance Sheets & Metrics', duration: '18 mins' },
            { number: '04', title: 'Scaling Profitable Digital Products', duration: '24 mins' }
        ]
    },
    {
        id: 'startup',
        title: 'From Idea to Startup Success',
        author: 'purepearl studio',
        category: 'Creative Marketing',
        tags: ['Featured', 'Creative Marketing', 'Marketing', 'Business'],
        level: 'Beginner',
        rating: 4.9,
        ratingCount: 290,
        reviewsCount: 205,
        studentsCount: 1560,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        price: 25,
        image: '/figma-images/course_6_team.jpg',
        subtitle: 'Build, validate, launch and scale high-growth products with modern teams',
        description: 'Master agile lean startup cycles, customer interviews, viral launch playbooks, fundraising fundamentals, and product-market fit.',
        descriptionParagraphs: [
            'Turn raw vision into sustainable, high-growth venture reality with "From Idea to Startup Success." This hands-on roadmap guides founders and builders through the critical stages of ideation, rapid validation, product-market fit, and team scaling.',
            'Learn how to conduct high-signal customer interviews that uncover true willingness to pay. Build high-converting minimal viable products (MVPs) in days rather than months, avoiding costly development traps and validating hypotheses early.',
            'Finally, master go-to-market viral loops, investor pitch deck storytelling, and early-stage fundraising dynamics. Gain the tactical playbook needed to lead agile teams and scale from zero to hundreds of thousands in annual recurring revenue.'
        ],
        sneakPeek: [
            '/figma-images/course_6_team.jpg',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80'
        ],
        keyPoints: [
            'Problem-Solution Fit & Lean Customer Discovery',
            'Rapid Prototyping & No-Code MVP Building',
            'Unit Economics, CAC, and LTV Optimization',
            'Organic Growth Loops & Viral Launch Strategies',
            'Venture Capital Pitching & Term Sheet Negotiation',
            'Hiring Early Teams & Scaling Company Culture'
        ],
        instructor: {
            name: 'Sarah Mitchell',
            role: 'Serial Founder & YC Alum',
            avatar: '/figma-images/avatar_sarah_m.png',
            bio: '2x founder and angel investor who has raised over $14M in venture capital and mentored 60+ breakout startups.'
        },
        lessons: [
            { number: '01', title: 'Validating Problems & Target Audiences', duration: '12 mins' },
            { number: '02', title: 'Building Rapid Prototypes & MVPs', duration: '19 mins' },
            { number: '03', title: 'Viral Go-To-Market Strategies', duration: '20 mins' },
            { number: '04', title: 'Scaling Unit Economics & Pitching', duration: '15 mins' }
        ]
    },
    {
        id: 'music-production',
        title: 'Modern Music Production with Ableton',
        author: 'purepearl studio',
        category: 'Music',
        tags: ['Featured', 'Music'],
        level: 'Beginner',
        rating: 4.8,
        ratingCount: 310,
        reviewsCount: 220,
        studentsCount: 1420,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        price: 25,
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
        subtitle: 'Compose, mix, and master electronic music and beats from scratch',
        description: 'Learn modern sound design, audio synthesis, MIDI arrangement, beatmaking, and vocal processing in Ableton Live to produce radio-ready tracks.',
        descriptionParagraphs: [
            'Unleash your sonic creativity with "Modern Music Production with Ableton." This comprehensive audio journey takes you from the opening blank arrangement timeline to delivering commercially polished, radio-ready tracks that command dancefloors and streaming playlists.',
            'Dive headfirst into Ableton Live’s intuitive interface, understanding Session and Arrangement workflows, sample management, and drum rack programming. Master sidechain compression, audio warping, and rhythmic pocket creation that gives your tracks unshakeable groove.',
            'In the advanced modules, unlock analog and wavetable synthesis, lush atmospheric reverbs, and vocal tuning techniques. Finish with industry-standard mixing and mastering protocols ensuring your tracks translate with punch and clarity on any speaker system.'
        ],
        sneakPeek: [
            'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80'
        ],
        keyPoints: [
            'Ableton Live Workflow & Audio Interface Setup',
            'Drum Machine Programming & Punchy Low-End',
            'Wavetable Synthesis, Basslines & Leads',
            'Vocal Production, Autotune & Reverb Spacing',
            'Equalization, Multiband Dynamics & Compression',
            'Commercial Loudness Mastering for Spotify & Apple'
        ],
        instructor: {
            name: 'Leon Mercer',
            role: 'Platinum Sound Designer & Producer',
            avatar: '/figma-images/bfd09b20f2cf44bfa3af771f6396363d4ae67aab.jpg',
            bio: 'Chart-topping electronic music producer and Ableton certified trainer with credits spanning major record labels.'
        },
        lessons: [
            { number: '01', title: 'DAW Workspace & Audio Setup', duration: '14 mins' },
            { number: '02', title: 'Drum Programming & Groove Creation', duration: '18 mins' },
            { number: '03', title: 'Basslines & Lead Synthesizers', duration: '22 mins' },
            { number: '04', title: 'Audio Effects, EQ & Compression', duration: '20 mins' },
            { number: '05', title: 'Mixing & Mastering Final Tracks', duration: '25 mins' }
        ]
    },
    {
        id: 'beatmaking',
        title: 'Beatmaking & Electronic Sound Synthesis',
        author: 'purepearl studio',
        category: 'Music',
        tags: ['Featured', 'Music'],
        level: 'Beginner',
        rating: 4.7,
        ratingCount: 195,
        reviewsCount: 110,
        studentsCount: 880,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        price: 25,
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        subtitle: 'Master modular synthesis, sample chopping, and hip hop / lo-fi beats',
        description: 'Explore the foundations of sampling, analog and digital synthesis, melodic hook composition, and creative sound design.',
        descriptionParagraphs: [
            'Enter the captivating rhythm lab of modern beatmaking with "Beatmaking & Electronic Sound Synthesis." Designed for producers seeking distinctive sound signatures, this course dives into the soul of vinyl sampling, MPC-style pad drumming, and lush harmonic synthesis.',
            'Learn to source, slice, and pitch-shift rare vinyl samples with pinpoint accuracy. Master swing nuances, humanized velocity programming, and thunderous 808 basslines that drive hip-hop, trap, and lo-fi chill productions.',
            'Explore subtractive synthesis, warm tape emulation, and analog chorus modulation to craft signature soundscapes. By course completion, you will construct a comprehensive beat tape ready for streaming release and sync licensing.'
        ],
        sneakPeek: [
            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'
        ],
        keyPoints: [
            'Vinyl Sample Slicing & Vintage Pitch Envelopes',
            'Groove Swing, Pocket Timing & Ghost Notes',
            'Analog Synthesizer Filters & Modulation LFOs',
            'Layering 808s with Sub-Bass Harmonic Saturation',
            'Lo-Fi Tape Warmth & Vinyl Crackle Texturing',
            'Arranging Dynamic Beat Drops & Seamless Transitions'
        ],
        instructor: {
            name: 'Kai Nakamura',
            role: 'Beatmaker & Audio Engineer',
            avatar: '/figma-images/avatar_james_l.png',
            bio: 'Tokyo-based sample crafter and hip hop producer whose sample packs have been downloaded by 100k+ musicians.'
        },
        lessons: [
            { number: '01', title: 'History & Anatomy of Modern Beats', duration: '12 mins' },
            { number: '02', title: 'Sample Slicing & Pitch Shifting', duration: '16 mins' },
            { number: '03', title: 'Synthesizer Oscillators & Filters', duration: '20 mins' },
            { number: '04', title: 'Arranging & Exporting Beat Tapes', duration: '18 mins' }
        ]
    },
    {
        id: 'illustration-art',
        title: 'Drawing & Painting: Digital Art Masterclass',
        author: 'purepearl studio',
        category: 'Drawing & Painting',
        tags: ['Featured', 'Drawing & Painting', 'Design'],
        level: 'Beginner',
        rating: 4.9,
        ratingCount: 420,
        reviewsCount: 290,
        studentsCount: 1980,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        price: 25,
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
        subtitle: 'Learn digital illustration, character sketches, and lighting theory',
        description: 'Master anatomy, dynamic posing, digital brush textures, shading, and cinematic lighting to create stunning illustrations.',
        descriptionParagraphs: [
            'Ignite your artistic vision with "Drawing & Painting: Digital Art Masterclass." Guided by veteran concept artists, this immersive course transforms beginners and intermediate sketchers into confident digital illustrators capable of producing breathtaking visual storytelling.',
            'Develop unshakeable draftsmanship fundamentals starting with gesture drawing, volumetric head construction, and dynamic anatomy poses. Discover how to control digital pressure curves, layer blend modes, and custom textured brushes.',
            'Ascend to advanced cinematic color keys, dramatic rim lighting, and atmospheric occlusion shading. Create stunning concept art and character illustrations ready for gaming studios, editorial commissions, and gallery art books.'
        ],
        sneakPeek: [
            'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
            '/figma-images/a7c9406fd05787fc6c03edf5db05f212b96366a6.jpg'
        ],
        keyPoints: [
            'Digital Stylus Pressure & Custom Brush Creation',
            'Human Anatomy, Proportions & Expressive Gesture',
            'One, Two & Three-Point Perspective Foundations',
            'Color Harmonization, Values & Rim Lighting',
            'Rendering Textures: Skin, Metal, Cloth & Foliage',
            'Building a High-Impact Industry Art Portfolio'
        ],
        instructor: {
            name: 'Amara Chen',
            role: 'Concept Artist & Illustrator',
            avatar: '/figma-images/71d7929ee0ecb2198c9955a8e842f4991dcb4655.jpg',
            bio: 'Senior visual development artist who has contributed characters and environments to acclaimed fantasy games.'
        },
        lessons: [
            { number: '01', title: 'Digital Canvas & Brush Mechanics', duration: '15 mins' },
            { number: '02', title: 'Perspective & Line Art Confidence', duration: '20 mins' },
            { number: '03', title: 'Color Palettes & Lighting Magic', duration: '24 mins' },
            { number: '04', title: 'Finishing Touches & Portfolio Ready', duration: '18 mins' }
        ]
    },
    {
        id: 'cooking-mastery',
        title: 'Mastering Gourmet Cooking & Culinary Arts',
        author: 'purepearl studio',
        category: 'Cooking',
        tags: ['Featured', 'Cooking'],
        level: 'Beginner',
        rating: 4.9,
        ratingCount: 380,
        reviewsCount: 260,
        studentsCount: 1750,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        price: 25,
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80',
        subtitle: 'Professional chef knife skills, sauce foundations, and modern plating',
        description: 'Elevate your culinary instincts with essential chef techniques, flavor balancing, artisanal seasoning, and high-end restaurant plating.',
        descriptionParagraphs: [
            'Step into the professional kitchen with "Mastering Gourmet Cooking & Culinary Arts." Taught by executive Michelin-trained chefs, this course strips away intimidation and equips home cooks with the exact techniques that define high-end fine dining restaurants.',
            'Master precision knife cuts—julienne, brunoise, and chiffonade—that ensure uniform cooking and stunning visual presentation. Demystify the five classic French mother sauces and understand how acid, salt, fat, and heat harmonize on the palate.',
            'Learn the secrets of restaurant-grade pan searing, butter basting with aromatic herbs, and sauce emulsification. Finally, explore architectural plating aesthetics, microgreens garnishing, and multi-course meal timing that will dazzle any dinner guest.'
        ],
        sneakPeek: [
            'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80'
        ],
        keyPoints: [
            'Razor-Sharp Knife Handling & Precision Cuts',
            'The Five French Mother Sauces & Reductions',
            'Maillard Reaction, Perfect Pan Searing & Resting',
            'Artisanal Seasoning & Acid-Salt-Fat Balance',
            'Modern Fine Dining Plating & Architectural Garnishes',
            'Menu Curating & Dinner Party Multi-Course Prep'
        ],
        instructor: {
            name: 'Chef Mateo Rossi',
            role: 'Michelin-Star Executive Chef',
            avatar: '/figma-images/avatar_sarah_m.png',
            bio: 'Culinary institute graduate with over 15 years helming top kitchens across Florence, Paris, and New York.'
        },
        lessons: [
            { number: '01', title: 'Knife Skills & Kitchen Safety', duration: '16 mins' },
            { number: '02', title: 'The Mother Sauces & Flavor Building', duration: '22 mins' },
            { number: '03', title: 'Pan Searing & Temperature Control', duration: '18 mins' },
            { number: '04', title: 'Plating Aesthetics & Presentation', duration: '20 mins' }
        ]
    },
    {
        id: 'cooking-baking',
        title: 'Artisanal Pastry & Baking Fundamentals',
        author: 'purepearl studio',
        category: 'Cooking',
        tags: ['Featured', 'Cooking'],
        level: 'Beginner',
        rating: 4.8,
        ratingCount: 290,
        reviewsCount: 185,
        studentsCount: 1320,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        price: 25,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
        subtitle: 'Master classic French pastry doughs, breads, sourdough, and desserts',
        description: 'From lamination to sourdough fermentation, master the science and artistry of world-class baking with step-by-step guidance.',
        descriptionParagraphs: [
            'Experience the timeless magic of the artisanal bakery in "Artisanal Pastry & Baking Fundamentals." Discover how simple ingredients—flour, water, salt, and yeast—combine through precise baker’s math and technique to produce bakery-quality masterpieces.',
            'Uncover the science of gluten development, ambient fermentation kinetics, and maintaining a vigorous sourdough starter. Learn folding routines, shaping boules with tight surface tension, and scoring patterns that bloom into deep ear crusts.',
            'Step into French pâtisserie by conquering butter block lamination for flaky, honeycomb croissants, silky vanilla bean pastry cream, and delicate fruit tart shells. Transform your kitchen into a sanctuary of golden aromas and culinary pride.'
        ],
        sneakPeek: [
            'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80'
        ],
        keyPoints: [
            'Hydration Percentages & Baker\'s Math Foundations',
            'Maintaining Active Wild Sourdough Cultures',
            'Butter Block Lamination for Flaky Croissants',
            'Silky Pâtisserie Crèmes, Curds & Ganaches',
            'Oven Steam Injections for Golden Blistered Crusts',
            'Troubleshooting Over-Proofing & Ambient Temperature'
        ],
        instructor: {
            name: 'Claire Fontaine',
            role: 'Master Boulangère & Pâtissière',
            avatar: '/figma-images/teacher_female.png',
            bio: 'Parisian trained head baker passionate about slow fermentation and heritage artisan pastry methods.'
        },
        lessons: [
            { number: '01', title: 'Baking Science: Gluten & Hydration', duration: '15 mins' },
            { number: '02', title: 'Sourdough Starters & Fermentation', duration: '22 mins' },
            { number: '03', title: 'Croissant Lamination & Flaky Pastry', duration: '25 mins' },
            { number: '04', title: 'Custards, Tart Shells & Glazes', duration: '18 mins' }
        ]
    },
    {
        id: 'motion-animation',
        title: 'Character Animation & Motion Graphics',
        author: 'purepearl studio',
        category: 'Animation',
        tags: ['Featured', 'Animation', 'Design'],
        level: 'Beginner',
        rating: 4.7,
        ratingCount: 215,
        reviewsCount: 135,
        studentsCount: 1040,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        price: 25,
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
        subtitle: 'Bring illustrations to life with 12 principles of animation and After Effects',
        description: 'Understand easing, squash and stretch, character rigging, and kinetic typography to produce viral animations.',
        descriptionParagraphs: [
            'Breathe life and personality into static artwork with "Character Animation & Motion Graphics." This high-energy course unlocks the physics of motion, teaching you how to make characters jump, react, and emote with authentic weight and flair.',
            'Master the timeless 12 Principles of Animation adapted for the modern digital era—including squash and stretch, anticipatory motion, follow-through, and secondary action. Gain absolute command over speed curves and graph editors in After Effects.',
            'Rig vector characters using bone networks and inverse kinematics for fluid walk cycles. Learn to animate kinetic UI micro-interactions, explosive shape bursts, and render buttery-smooth 60fps animations for web and social feeds.'
        ],
        sneakPeek: [
            'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
            '/figma-images/0c1762672f5c64aa67de3991c2ac4aa729328623.jpg',
            '/figma-images/d443b5217bfd460249d4ac0712aa129bc29a8919.jpg',
            '/figma-images/2e1b62a2460ffba94cc633550f3a06e03b29b432.jpg'
        ],
        keyPoints: [
            'The 12 Disney Principles Applied to Modern Motion',
            'Bézier Curve Graph Editors & Seamless Easing',
            '2D Puppet Rigging, Inverse Kinematics & Bones',
            'Walk & Run Cycles with Weight and Momentum',
            'Kinetic Typography & High-Energy Social Transitions',
            'Exporting Optimized Lottie JSON & 60fps MP4s'
        ],
        instructor: {
            name: 'Darius Kael',
            role: 'Lead Motion Designer & 3D Animator',
            avatar: '/figma-images/avatar_alex_b.png',
            bio: 'Award-winning motion director whose animations have spotlighted global campaigns for top tech brands.'
        },
        lessons: [
            { number: '01', title: 'Core Principles of Motion', duration: '12 mins' },
            { number: '02', title: 'Rigging 2D Characters', duration: '24 mins' },
            { number: '03', title: 'Walk Cycles & Weight Dynamics', duration: '20 mins' },
            { number: '04', title: 'Rendering Smooth 60fps Motion', duration: '16 mins' }
        ]
    },
    {
        id: 'social-branding',
        title: 'Social Media Strategy & Viral Growth',
        author: 'purepearl studio',
        category: 'Social Media',
        tags: ['Featured', 'Social Media', 'Creative Marketing', 'Marketing'],
        level: 'Beginner',
        rating: 4.8,
        ratingCount: 340,
        reviewsCount: 245,
        studentsCount: 1620,
        lessonsCount: 17,
        duration: '2 hours 16 mins',
        price: 25,
        image: '/figma-images/course_6_team.jpg',
        subtitle: 'Build loyal communities and scale personal brands on modern social channels',
        description: 'Proven strategies for short-form video hooks, audience retention algorithms, content calendars, and brand partnerships.',
        descriptionParagraphs: [
            'Cut through digital noise and command genuine attention with "Social Media Strategy & Viral Growth." Discover the exact methodologies utilized by top digital creators to build engaged, monetization-ready followings across modern channels.',
            'Deconstruct the algorithmic triggers of Instagram Reels, TikTok, YouTube Shorts, and X. Learn how to script punchy three-second hooks, optimize visual pacing for maximum completion rates, and systematically test viral content formats.',
            'Develop an automated weekly production engine that repurposes one hero piece of content into multiple bite-sized assets. Turn audience momentum into a thriving commercial business with digital products, community tiers, and high-ticket sponsorships.'
        ],
        sneakPeek: [
            '/figma-images/course_6_team.jpg',
            '/figma-images/0c1762672f5c64aa67de3991c2ac4aa729328623.jpg',
            'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80'
        ],
        keyPoints: [
            'Cracking Recommendation Algorithms in 2026',
            'High-Retention 3-Second Visual & Audio Hooks',
            'Multi-Platform Repurposing & Automated Content Engines',
            'Community Flywheels & Super-Fan Monetization',
            'Securing High-Paying Brand Sponsorship Deals',
            'Data Analytics: Tracking Virality and Watch-Time Ratios'
        ],
        instructor: {
            name: 'Sofia Sterling',
            role: 'Viral Growth Strategist & Creator',
            avatar: '/figma-images/avatar_sarah_m.png',
            bio: 'Creator economy consultant who has generated over 120M organic views across client campaigns.'
        },
        lessons: [
            { number: '01', title: 'Cracking the Algorithm in 2026', duration: '15 mins' },
            { number: '02', title: 'High-Retention Hook Writing', duration: '18 mins' },
            { number: '03', title: 'Repurposing Across Platforms', duration: '20 mins' },
            { number: '04', title: 'Monetizing Your Audience', duration: '22 mins' }
        ]
    }
];

// Helper to authenticate user from cookie or authorization header
function getAuthUser(req) {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token || token === 'none') return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bytespacesecretkey123');
        return decoded;
    } catch (e) {
        return null;
    }
}

// @desc    Get all available catalog courses
// @route   GET /api/courses
router.get('/', (req, res) => {
    res.json({
        success: true,
        count: COURSES_CATALOG.length,
        data: COURSES_CATALOG
    });
});

// @desc    Get course by ID
// @route   GET /api/courses/:id
router.get('/:id', (req, res) => {
    const course = COURSES_CATALOG.find(c => c.id === req.params.id);
    if (!course) {
        return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.json({
        success: true,
        data: course
    });
});

// @desc    Get enrolled courses for logged-in user
// @route   GET /api/courses/user/my-courses
router.get('/user/my-courses', async (req, res) => {
    try {
        const auth = getAuthUser(req);
        if (!auth) {
            return res.status(401).json({ success: false, error: 'Not authenticated' });
        }

        const enrolled = await userService.getEnrolledCourses(auth.id);
        
        // Enrich enrolled courses with catalog info if missing
        const enriched = enrolled.map(c => {
            const catalogItem = COURSES_CATALOG.find(item => item.id === c.courseId);
            return {
                ...c,
                totalLessons: catalogItem ? catalogItem.lessonsCount : 17,
                duration: catalogItem ? catalogItem.duration : '2 hours 16 mins',
                rating: catalogItem ? catalogItem.rating : 4.5,
                lessons: catalogItem ? catalogItem.lessons : []
            };
        });

        // Also return suggested courses (courses not yet enrolled)
        const enrolledIds = new Set(enrolled.map(c => c.courseId));
        const suggested = COURSES_CATALOG.filter(c => !enrolledIds.has(c.id));

        res.json({
            success: true,
            count: enriched.length,
            data: enriched,
            suggested: suggested
        });
    } catch (err) {
        console.error('Error in my-courses:', err.message);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// @desc    Checkout & enroll in cart courses
// @route   POST /api/courses/checkout
router.post('/checkout', async (req, res) => {
    try {
        const auth = getAuthUser(req);
        if (!auth) {
            return res.status(401).json({ success: false, error: 'Please sign in to complete checkout' });
        }

        const { items, paymentMethod, paymentDetails, promoCode } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, error: 'Your cart is empty' });
        }

        // Validate items and ensure correct course metadata
        const validCourses = items.map(item => {
            const courseId = item.id || item.courseId;
            const catalogCourse = COURSES_CATALOG.find(c => c.id === courseId);
            return {
                courseId: courseId,
                courseTitle: catalogCourse ? catalogCourse.title : (item.title || item.courseTitle),
                author: catalogCourse ? catalogCourse.author : (item.author || 'purepearl studio'),
                image: catalogCourse ? catalogCourse.image : (item.image || '/figma-images/course_1_wireframe.jpg'),
                price: catalogCourse ? catalogCourse.price : (Number(item.price) || 25),
                progress: 0,
                completedLessons: []
            };
        });

        // Calculate total
        const subtotal = validCourses.reduce((sum, c) => sum + c.price, 0);
        let discount = 0;
        if (promoCode && (promoCode.toUpperCase() === 'BYTE20' || promoCode.toUpperCase() === 'WELCOME10')) {
            discount = promoCode.toUpperCase() === 'BYTE20' ? subtotal * 0.20 : 10;
        }
        const total = Math.max(0, subtotal - discount);

        // Enroll user in courses
        const updatedEnrolled = await userService.enrollCourses(auth.id, validCourses);

        res.json({
            success: true,
            message: 'Enrollment successful! Your courses are ready.',
            orderId: 'ORD-' + Date.now().toString().slice(-6),
            paymentMethod: paymentMethod || 'credit_card',
            totalPaid: total,
            coursesCount: validCourses.length,
            enrolledCourses: updatedEnrolled
        });
    } catch (err) {
        console.error('Checkout error:', err.message);
        res.status(500).json({ success: false, error: 'Checkout failed. Please try again.' });
    }
});

// @desc    Update course progress
// @route   POST /api/courses/progress
router.post('/progress', async (req, res) => {
    try {
        const auth = getAuthUser(req);
        if (!auth) {
            return res.status(401).json({ success: false, error: 'Not authenticated' });
        }

        const { courseId, progress, lessonNumber } = req.body;
        if (!courseId) {
            return res.status(400).json({ success: false, error: 'courseId is required' });
        }

        const updated = await userService.updateCourseProgress(auth.id, courseId, progress, lessonNumber);
        res.json({
            success: true,
            data: updated
        });
    } catch (err) {
        console.error('Progress error:', err.message);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
