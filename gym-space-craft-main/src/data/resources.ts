import p1 from "@/assets/project-1.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";
import p5 from "@/assets/project-5.jpg";
import p6 from "@/assets/project-6.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import caseImg from "@/assets/case-study.jpg";
import floorplan from "@/assets/floorplan.jpg";
import whyMaterials from "@/assets/why-materials.jpg";
import gymLayout from "@/assets/gym-layout.jpg";
import heroGym from "@/assets/hero-gym.jpg";
import workHero from "@/assets/work-hero.jpg";

/** Add a category here and the Resources filter tabs pick it up. */
export const blogCategories = [
  "Planning",
  "Equipment & Layout",
  "Materials & Maintenance",
  "Wellness Space Design",
] as const;
export type BlogCategory = (typeof blogCategories)[number];

export const BLOG_AUTHOR = "by sagrika saraf";

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  highlight?: string;
  image: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoCanonical?: string;
  /** Slug of the project this article links into. */
  projectSlug: string;
  createdAt?: string;
  updatedAt?: string;
  body: {
    heading: string;
    text?: string;
    points?: { heading: string; text: string; image?: string }[];
  }[];
};

export const posts: BlogPost[] = [
  {
    slug: "gym-planning-mistakes-first-time-owners-make",
    title: "Planning an ice plunge? Don't make these mistakes",
    category: "Wellness Space Design",
    readTime: "4 min",
    excerpt:
      "An ice plunge is more than a tub. The space around it needs to be planned for safety, maintenance and the experience of the person using it.",
    image: p1,
    projectSlug: "iron-standard",
    body: [
      {
        heading: "It needs its own space",
        text: "Do not place an ice plunge wherever you find an empty corner. Plan the space around the plunge from the beginning, considering drainage, water access, maintenance and how people will enter, use and leave the area.",
      },
      {
        heading: "What should you plan for?",
        points: [
          {
            heading: "Proper drainage",
            text: "Water will be part of the everyday use, so drainage needs to be considered before installation.",
          },
          {
            heading: "A water point",
            text: "Make sure there is convenient access to a water point for filling, cleaning and regular maintenance.",
          },
          {
            heading: "Anti-skid flooring",
            text: "Wet areas need flooring that can handle water while providing a safer surface underfoot.",
            image: whyMaterials,
          },
          {
            heading: "Space for towels and seating",
            text: "The experience does not end when someone steps out of the plunge. Allow space for towels and somewhere to sit.",
            image: floorplan,
          },
        ],
      },
      {
        heading: "Do not forget ventilation",
        text: "An ice plunge area needs proper ventilation. Natural light can also add to the overall experience, especially when the space is part of a larger wellness environment.",
      },
      {
        heading: "The plunge is part of the experience",
        text: "A well-designed ice plunge should feel like part of the wellness journey, not an equipment item placed into leftover space.",
      },
    ],
  },
  {
    slug: "why-does-a-hospitality-gym-feel-like-a-throwaway",
    title: "Why does a hospitality gym feel like a throwaway?",
    category: "Wellness Space Design",
    readTime: "7 min",
    excerpt:
      "Hotel gyms are often treated as an amenity that simply needs to exist. But when fitness and wellness become part of the guest experience, the gym can be designed with the same thought and intention as the rest of the property.",
    highlight: "The gym should not be an add-on.\nIt should be part of the experience",
    image: heroGym,
    projectSlug: "sanctum-wellness",
    body: [
      {
        heading: "Why does a hospitality gym feel like a throwaway?",
        text: "Hotel gyms have long been a room that just needs to exist, not a space to be enjoyed—an afterthought. Often, they sit in basements, by pools, or in strange corners of a property, with a handful of machines to meet the basic expectation of a gym. But hospitality is about creating an experience. So why not design the fitness space with the same intention? As fitness and wellness become a bigger part of how people travel, hotel gyms have the chance to be more than just an amenity. They can be memorable spaces that contribute to the identity of the property and guest experience.",
      },
      {
        heading: "A Hotel Gym Can Be Part of the Guest Experience",
        text: "In hospitality design, we tend to think of the lobby, rooms, restaurants, lounges and outdoor spaces. The fitness space deserves the same care. A well-designed hospitality gym should feel part of the property around it. Its materials, colours, lighting and general design language can complement the hotel's identity and still create a space purpose-built for movement and training. It's not just about making the gym look good. It's to make the space feel deliberate.",
      },
      {
        heading: "What If the Gym Had the Best View?",
        text: "Often, the location itself is one of the biggest missed opportunities in hotel gym design. Why should the best views always be for the restaurant or lounge? A gym with a view of a garden, cityscape, pool or natural landscape can totally change the experience of working out. Natural views, good lighting and a sense of openness can all help create a less confined fitness space that feels more connected to the property. This is where good gym interior design becomes more than just aesthetics. It takes into account how users interact with the space when exercising, resting or moving through it.",
        points: [
          {
            heading: "Hotel gym with large windows overlooking a natural landscape",
            text: "",
            image: gallery1,
          },
        ],
      },
      {
        heading: "Place Identity as an Indicator of Fitness",
        text: "Hospitality also allows us to introduce local culture to fitness. India has an extensive heritage of physical training which includes wrestling, martial arts, traditional exercises and practices such as mudgars. These ideas can lead to fitness experiences that feel grounded in their place. For instance, a hotel in Amritsar can incorporate aspects of Punjab's traditional wrestling culture into its fitness offering. It doesn't have to be too literal or too thematic. This connection could be the training experience, the equipment, the materials, the graphics or even the way the space is designed. It can create a fitness environment that feels like part of the destination, not a generic hotel gym.",
      },
      {
        heading: "Good Gym Design Isn't About Packing in More Equipment",
        text: "It's often thought that all a better gym needs is more equipment. I don't think this is the place to start. The first question should be: How do people actually use this space? Placement of equipment, circulation, training zones, spacing and accessibility all play a role in how comfortable and functional a gym feels. A well-planned fitness space allows people enough room to move, while creating a clear relationship between the various activities. That's why gym space planning must come before esthetic decisions. A gym can look great, but if you can't move through it comfortably, it's not going to work.",
        points: [
          {
            heading: "Hotel gym with planned equipment spacing and clear circulation",
            text: "",
            image: gymLayout,
          },
        ],
      },
      {
        heading: "Lighting Can Transform the Whole Experience",
        text: "Lighting is another often overlooked element of fitness spaces. Lighting can be used to define different areas, set a mood and make the gym feel more connected to the rest of the house. In the hospitality setting, even strategies such as circadian lighting can be seen as an opportunity to create a more considered wellness experience. The idea is simple: lighting should do more than help people see. It should add to the feel of the place.",
        points: [
          {
            heading: "Hotel gym interior with layered architectural lighting",
            text: "",
            image: caseImg,
          },
        ],
      },
      {
        heading: "The gym doesn't have to be just a gym",
        text: "Hospitality spaces can serve many purposes too. Depending on the property and its guests, a fitness and wellness area could include spaces for relaxation, work, informal meetings, coffee or wellness activities. This gives the space more flexibility and allows the property to think outside the box of what a hotel gym is. Instead of asking: “Where do we put the gym?” we can ask, “What can this space be for our guests?” That shift in thinking can open up whole new possibilities.",
      },
      {
        heading: "From Amenity to an Experience",
        text: "The future of hospitality fitness is not about building bigger gyms or putting more machines in them. It's about creating better experiences. A well-designed hotel gym can be a reflection of the property's identity, a tie to its location, an opportunity to use its best views, a support to various types of users and a true part of the guest journey. Travel is becoming increasingly linked to fitness and wellness. So maybe it's time to stop treating the hospitality gym as an afterthought.",
      },
    ],
  },
  {
    slug: "from-equipment-to-experience-the-evolution-of-fitness-spaces-in-india",
    title: "From equipment to experience: the evolution of fitness spaces in India",
    category: "Planning",
    readTime: "8 min",
    excerpt:
      "Fitness spaces in India are changing as the people using them change. From equipment-led gyms to spaces built around training, recovery, community and experience, the way we design fitness environments is evolving too.",
    image: workHero,
    imageAlt: "Modern fitness space showing the evolution of gym interior design",
    projectSlug: "forge-24",
    body: [
      {
        heading: "From Equipment to Experience: The Evolution of Fitness Spaces in India",
        text: "For a long time, fitness in India was pretty straightforward. We go to the gym to work out. We had home made food. Protein was mostly associated with bodybuilders, and conversations about workouts and nutrition weren’t nearly as common as they are today. That has been altered. The post-COVID fitness and wellness movement has brought a very different audience into fitness spaces. Millennials who had to persuade their families to let them join a gym are now taking their families to the gym. And as the users of fitness spaces change, the spaces themselves have to change as well.",
      },
      {
        heading: "The Indian Gym Is More Than Equipment Now",
        text: "A gym used to be defined by a few familiar things: equipment, mirrors, loud music and room to exercise. That definition is becoming dated. Today, fitness spaces are being utilized by people of different ages, personalities and fitness goals. Some come for weightlifting. Some for group workouts. Some for recovery. Some for community. And more and more, people want to have a sense of belonging in the space. This is where gym interior design moves beyond esthetics. As soon as someone enters a space, the environment says something to them. It can make them feel motivated, comfortable, intimidated, welcomed or totally disconnected. Good design can influence that first feeling.",
        points: [
          {
            heading: "Modern gym interior with multiple training zones",
            text: "",
            image: p6,
          },
        ],
      },
      {
        heading: "Fitness is becoming a way of life",
        text: "Fitness is not just the hour you spend working out. People are looking more and more for community, personalized training and experiences that are built around goals. More and more, fitness is about how people socialize, recover, eat and spend their leisure time. This larger shift is evident in the growth of boutique fitness studios, community run clubs and wellness-oriented cafés. If fitness is a part of a person's life, then why should the spaces have to be just functional? The gym itself has to be part of the experience.",
      },
      {
        heading: "What I’m Seeing in My Projects",
        text: "I’ve noticed an interesting change in the conversations clients want to have in my work designing gyms of various sizes. Earlier, the conversation usually began with: “Where are we going to put the equipment?” Today I hear: We want our space to feel premium. What else we want to bring into the experience? From my experience of working on 15+ gyms, I’ve noticed that clients are thinking more than just fitting in as many machines as possible. They are thinking about what happens before the workout, during the workout and after the workout. That’s a huge change.",
      },
      {
        heading: "Recovery is now a part of the gym",
        text: "The biggest thing I’ve noticed is the presence of recovery spaces, becoming more and more. Saunas, contrast therapy, ice showers, massage rooms, infrared therapy, ice plunges and salt therapy are making their way into the modern fitness environment. And this is just the beginning I think. The gym concept is moving from just a place to train, to a place where you can train, recover and reset. This changes the way the whole space has to be planned. Recovery shouldn’t feel like an extra room at the end. It should be connected to the training areas and overall journey through the space.",
      },
      {
        heading: "Business Too Can Be Influenced by Design",
        text: "What I find especially interesting is how the conversation about design often turns into a conversation about revenue.\n\nThink of a gym where:\n\n• A Zumba class can easily be transformed into a strength training class.\n• A recovery zone is a place for members to slow down.\n• The reception area also doubles as a cozy coffee space.\n• Each zone of workout has its own identity.\n• Members have areas they naturally want to spend time and create content.\n\nThese may seem like small design decisions. But together they can change how people experience the facility. Interior design influences how people perceive a brand. And as the experience gets more powerful, the value of the space can transcend the workout itself.",
      },
      {
        heading: "Plan around workout flow space",
        text: "A beautiful gym isn’t enough if it doesn’t work well. The design needs to respond to how people actually train. Different types of training such as strength training, functional training, cardio, group workouts and recovery all have different spatial requirements. Specialized zones can help to make the space more understandable and more comfortable to use. This is why gym space planning and equipment layout should be considered as part of the design process – not treated as an afterthought after the interiors are decided. The equipment matters. But it is the relationship between equipment, user and space that makes the environment work.",
      },
      {
        heading: "Lighting Has the Power to Transform the Energy of a Space",
        text: "Lighting is one of the most powerful tools in gym interior design. The lighting strategy for a high energy training zone could be very different from a recovery space. Lighting can highlight a strength area, energize a workout zone or slow the pace of a recovery environment. Daylight is just as important. I firmly believe that one of the easiest ways to create a more wellness-oriented environment is to bring natural light into a fitness space whenever the site allows. The days of the dark, enclosed “gym cave” need not be the defining factor in fitness design any longer.",
        points: [
          {
            heading: "Gym interior combining natural and architectural lighting",
            text: "",
            image: p4,
          },
        ],
      },
      {
        heading: "Your gym is your brand",
        text: "If you’re a fitness business planning on opening multiple locations or franchising, interior design becomes even more important. A brand shouldn’t be identifiable just because you put its logo on the wall. The space itself should speak to the brand. Spatial planning, materials, lighting, colors and architectural details can all work together to create a consistent experience across locations. The design can tell a story instead of just repeating a logo or a color palette. That’s how a fitness brand can begin to feel familiar before a member even sees its name.",
      },
      {
        heading: "The Future of Fitness Facilities",
        text: "What we are witnessing in India’s fitness industry is only the beginning. As the industry attracts more people and consumer expectations continue to shift, fitness spaces will need to evolve with them. The most successful gym of the future may not be the one with the most equipment. Perhaps the one that understands its users the best. A place to train, recover, connect, create, hang out and feel like you’re part of something. And that’s why I think that the interior design for gyms is as important as the equipment itself. Because the space is experienced before the equipment by members.",
      },
    ],
  },
  {
    slug: "boutique-fitness-gyms-the-new-era-of-fitness",
    title: "Boutique fitness gyms: the new era of fitness",
    category: "Equipment & Layout",
    readTime: "7 min",
    excerpt:
      "Fitness is moving beyond equipment and workouts. Boutique studios are creating more specialised, experience-led spaces built around training, recovery, wellness and the way people want to spend their time.",
    image: p4,
    imageAlt: "Boutique fitness gym interior designed around experience and movement",
    projectSlug: "sanctum-wellness",
    body: [
      {
        heading: "The rise of boutique fitness",
        text: "Boutique studios for HIIT, Yoga, Pilates, Spinning and Barre are emerging as a growing category, with consumers looking for more specialised experiences around their goals and wellness.",
      },
      {
        heading: "Premium does not have to mean more",
        text: "Premium fitness spaces are moving away from visual clutter, excessive colour and too many materials toward restraint, warmer tones, natural materials and a more considered experience.",
      },
      {
        heading: "Give the equipment room to breathe",
        text: "Fewer machines with better circulation can create a more comfortable and intuitive workout environment than simply trying to fit more equipment into the floor.",
        points: [
          {
            heading: "Boutique gym interior with clear equipment spacing and circulation",
            text: "",
            image: p3,
          },
        ],
      },
      {
        heading: "Design the complete member journey",
        text: "The design needs to consider what happens from the moment someone enters: what they see, how they move, where they change, prepare, train and eventually access recovery.",
      },
      {
        heading: "Recovery is part of the experience",
        text: "Saunas, red light therapy, recovery massage, salt therapy, steam baths and ice plunges are becoming part of premium fitness environments. The key is that these spaces need to be designed as experiences, rather than simply adding equipment into an available corner.",
        points: [
          {
            heading: "Wellness and recovery space within a boutique fitness environment",
            text: "",
            image: p5,
          },
        ],
      },
      {
        heading: "Premium is about smarter design",
        text: "A premium gym does not necessarily require an enormous interiors budget. Equipment planning, movement space, recovery areas, spatial hierarchy and acoustics can have a major impact on how the space functions.",
      },
      {
        heading: "The gym is becoming a lifestyle destination",
        text: "Cafés, co-working spaces and spas are extending the amount of time members spend inside a facility. This turns interior design into more than an aesthetic decision. It becomes part of the business experience.",
      },
      {
        heading: "Why should someone spend their Saturday morning here?",
        text: "Gyms are increasingly competing on the experience they create, not simply the workout they provide.",
      },
    ],
  },
  {
    slug: "why-some-gyms-look-expensive-5-design-choices-that-make-a-difference",
    title: "Why some gyms look expensive: 5 design choices that make a difference",
    category: "Planning",
    readTime: "5 min",
    excerpt:
      "A gym does not need an enormous interiors budget to feel premium. Often, the difference comes from what you choose to leave out, how you use space, and how carefully materials and lighting work together.",
    image: caseImg,
    imageAlt: "Premium gym interior with sophisticated lighting and restrained material palette",
    highlight: "That is what makes a gym feel expensive without having to make everything expensive.",
    projectSlug: "north-block-strength",
    body: [
      {
        heading: "01. They avoid over-decorating",
        text: "Luxury does not always mean adding more.\n\nToo many colours, graphics, finishes and decorative elements can make a gym feel visually crowded. A more considered approach is to edit the space and allow the important elements to stand out.\n\nIn a premium fitness space, every design element should have a reason to be there.\n\nLess visual noise can create a stronger impression.",
      },
      {
        heading: "02. They respect negative space",
        text: "One of the easiest ways to make a gym feel more considered is to give the space room to breathe.\n\nWhen equipment is packed together, the floor can quickly feel crowded and difficult to navigate. Good gym space planning looks at the space between equipment just as carefully as the equipment itself.\n\nClear circulation makes the gym easier to understand, easier to use and more comfortable during busy hours.\n\nEmpty space is not wasted space when it improves how the gym works.",
        points: [
          {
            heading: "Gym interior with clear circulation and negative space between equipment",
            text: "",
            image: p3,
          },
        ],
      },
      {
        heading: "03. They use fewer materials",
        text: "A premium interior does not need five different finishes in every room.\n\nUsing a limited material palette can create a stronger visual identity and make the overall space feel more cohesive. Wood, stone, metal, flooring and other finishes should work together rather than compete for attention.\n\nThe goal is not to use expensive materials everywhere.\n\nIt is to make a few materials work harder.",
      },
      {
        heading: "04. They focus on lighting",
        text: "Lighting can completely change how a gym feels.\n\nInstead of relying on one uniform ceiling light, different areas can use different lighting approaches depending on their function. Training zones may need a more energetic atmosphere, while reception, recovery or lounge areas can have a softer character.\n\nArchitectural lighting can also highlight materials, define zones and create depth within the space.\n\nGood lighting does more than illuminate a gym. It shapes the experience.",
        points: [
          {
            heading: "Gym interior with layered architectural lighting",
            text: "",
            image: p4,
          },
        ],
      },
      {
        heading: "05. They design the experience, not just the workout floor",
        text: "A gym can have great equipment and still feel ordinary.\n\nWhat makes a space memorable is how everything comes together: the entrance, circulation, equipment layout, materials, lighting, acoustics and the overall feeling of the space.\n\nThe best gym interiors do not try to impress through excess.\n\nThey create a space that feels clear, intentional and easy to experience.",
      },
      {
        heading: "The real secret to a premium gym",
        text: "A premium gym is not necessarily the one where the most money has been spent on interiors.\n\nIt is the one where every decision has been considered.\n\nLess clutter.\nBetter circulation.\nA controlled material palette.\nThoughtful lighting.\nAnd a space designed around how people actually use it.",
      },
    ],
  },
  {
    slug: "gym-flooring-how-to-choose-materials-that-can-handle-daily-use",
    title: "Gym flooring: how to choose materials that can handle daily use",
    category: "Materials & Maintenance",
    readTime: "5 min",
    excerpt:
      "Gym flooring has to do more than look good. It needs to handle equipment, impact, movement, moisture and everyday maintenance without becoming difficult to live with.",
    image: gallery1,
    imageAlt: "Gym flooring designed for equipment, movement and daily use",
    projectSlug: "still-house-recovery",
    body: [
      {
        heading: "Your floor is working as hard as your equipment",
        text: "Gym flooring is one of those decisions that is easy to underestimate.\n\nIt has to deal with heavy equipment, constant movement, dropped weights, sweat, cleaning and thousands of footsteps every day. A material that looks great on day one may not be the right choice if it cannot handle how the space will actually be used.\n\nThat is why flooring should be considered as part of the gym interior design from the beginning.",
      },
      {
        heading: "Start with how the space will be used",
        text: "There is no single flooring material that works equally well for every part of a gym.\n\nA strength training area has very different requirements from a cardio zone, studio, reception or recovery space.\n\nBefore choosing a finish, ask:\n\n• What type of training will happen here?\n• Will weights be dropped?\n• How much movement will the area see?\n• Does the space regularly get wet?\n• How easy does it need to be to clean?\n• Will equipment remain fixed or move frequently?\n\nThe activity should influence the material, not the other way around.",
        points: [
          {
            heading: "Durable rubber flooring in a gym strength training area",
            text: "",
            image: p1,
          },
        ],
      },
      {
        heading: "Durability matters more than the sample",
        text: "A flooring sample can look perfect in a meeting room.\n\nBut a gym floor needs to perform under real conditions.\n\nHigh-use areas need materials that can withstand regular impact, friction and cleaning. Strength areas may need a more robust surface, while lower-impact spaces can have different requirements.\n\nThe right question is not:\n“Does this flooring look premium?”\nIt is:\n“Will this flooring still work after years of daily use?”",
      },
      {
        heading: "Maintenance should be part of the design",
        text: "A gym is cleaned constantly.\n\nSweat, dust, moisture and everyday wear are unavoidable. This means maintenance cannot be treated as an afterthought.\n\nConsider how easily the flooring can be cleaned, how joints or edges will hold up, whether dirt will collect in details and how easily damaged sections can be repaired or replaced.\n\nA material that requires complicated maintenance may become an operational problem later.",
        points: [
          {
            heading: "Gym flooring material detail showing texture and floor transition",
            text: "",
            image: whyMaterials,
          },
        ],
      },
      {
        heading: "Different zones can need different flooring",
        text: "Using one flooring material throughout the entire gym is not always the best solution.\n\nDifferent zones can have different requirements. The result can still feel cohesive without making every zone identical.",
        points: [
          {
            heading: "Strength training",
            text: "Needs a surface designed to handle heavier impact and equipment use.",
          },
          {
            heading: "Cardio",
            text: "Needs comfortable, durable flooring that can handle continuous movement.",
          },
          {
            heading: "Group training",
            text: "Needs a surface suitable for repeated movement and varied activities.",
          },
          {
            heading: "Recovery / wellness",
            text: "Needs materials appropriate for moisture, comfort and easy maintenance.",
          },
          {
            heading: "Reception / lounge",
            text: "Can use a more refined finish because the functional demands are different.",
          },
        ],
      },
      {
        heading: "Good material selection saves problems later",
        text: "Material decisions affect much more than the appearance of a gym.\n\nThey influence maintenance, durability, user comfort and how the space performs over time.\n\nThat is why we believe materials should be selected after understanding the space, not before it.",
      },
      {
        heading: "Final thought",
        text: "A good gym floor should almost disappear into the experience.\n\nIt should support the training, handle the daily workload and remain practical to maintain without constantly demanding attention.\n\nChoose materials for how the gym will be used, not just how they look in a sample.",
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export type Download = {
  slug: string;
  title: string;
  format: string;
  useTime: string;
  summary: string;
  covers: string[];
  image: string;
  file: string;
  body: string[];
};

export const downloads: Download[] = [
  {
    slug: "first-time-gym-owners-planning-checklist",
    title: "A First-Time Gym Owner's Planning Checklist",
    format: "PDF checklist · 6 sections",
    useTime: "",
    summary:
      "The key checks to work through before committing to a gym space, from the lease and building to circulation, services and the training programme.",
    covers: [
      "Before signing the lease",
      "Check the building",
      "Test the gym programme",
      "Think about circulation",
    ],
    image: heroGym,
    file: "/downloads/first-time-gym-owners-planning-checklist.pdf",
    body: [
      "Most first-time owners come to us after the lease is signed and the equipment is ordered. By then, two of the biggest layout decisions have already been made for them.",
      "This checklist is the version of that conversation you can run yourself. Work through it with the landlord's drawings in front of you and you will know whether the unit holds the gym you have in mind.",
    ],
  },
  {
    slug: "equipment-layout-and-circulation-guide",
    title: "Gym Equipment Layout & Circulation Guide",
    format: "PDF guide · 7 sections",
    useTime: "",
    summary:
      "A practical guide to equipment clearances, circulation and zoning before the workout floor is finalised.",
    covers: [
      "Start with the zones",
      "Equipment clearances",
      "Build a circulation spine",
      "Place turf, sleds & functional zones",
    ],
    image: workHero,
    file: "/downloads/equipment-layout-and-circulation-guide.pdf",
    body: [
      "Equipment spacing is where a floor is won or lost. Too tight and peak hour becomes a queue; too loose and you have paid rent on empty carpet.",
      "These are the working numbers we draw to, with the peak-hour logic that produced them.",
    ],
  },
];

export function getDownload(slug: string) {
  return downloads.find((d) => d.slug === slug);
}

export const resourceFaqs = [
  {
    q: "01. Are the downloads actually free?",
    a: "Yes. We ask for your name and email so we know who is planning what. The guides themselves are free to access.",
  },
  {
    q: "02. Can I use these guides with my own designer or contractor?",
    a: "Yes. They are written as practical working documents to help you think through your project and make informed design decisions.",
  },
  {
    q: "03. Who are these resources for?",
    a: "They are for gym owners, fitness businesses, wellness operators and anyone planning or developing a fitness or wellness space.",
  },
  {
    q: "04. What topics do you cover?",
    a: "The resources cover practical topics around gym interior design, space planning, equipment planning, lighting, materials, wellness spaces and the changing experience of fitness environments.",
  },
  {
    q: "05. Can you write about a specific problem I am facing?",
    a: "Yes. Send your question through the enquiry form. Questions that can help others may become future insights or resources.",
  },
];
