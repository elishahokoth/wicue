
// Mock users data
export const mockUsers = [{
  id: 'user-1',
  name: 'Admin User',
  email: 'admin@wicue.com',
  password: 'admin123',
  role: 'admin',
  status: 'active'
}, {
  id: 'user-2',
  name: 'Lecturer One',
  email: 'lecturer1@wicue.com',
  password: 'lecturer123',
  role: 'lecturer',
  status: 'active'
}, {
  id: 'user-3',
  name: 'Student One',
  email: 'student1@wicue.com',
  password: 'student123',
  role: 'student',
  status: 'active'
}, {
  id: 'user-4',
  name: 'Pending Lecturer',
  email: 'pending@wicue.com',
  password: 'pending123',
  role: 'lecturer',
  status: 'pending'
}];
// Mock courses data
export const mockCourses = [{
  id: 'course-1',
  title: 'Introduction to Wildlife',
  description: 'Learn the fundamentals of wildlife biology, ecology, and conservation. This course provides an overview of wildlife species, their habitats, and the challenges they face.',
  instructorId: 'user-2',
  thumbnail: 'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
  modules: [{
    id: 'module-1',
    title: 'Wildlife Classification and Taxonomy',
    description: 'Understanding how wildlife species are classified and organized.',
    content: 'This module covers the basics of wildlife taxonomy, including the classification system, scientific naming conventions, and major taxonomic groups of wildlife.',
    videoUrl: 'https://example.com/videos/wildlife-taxonomy',
    assessment: {
      id: 'assessment-1',
      title: 'Wildlife Classification Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'What is the scientific name for the African Lion?',
        options: ['Panthera leo', 'Felis catus', 'Panthera tigris', 'Acinonyx jubatus'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'Which of the following is NOT a mammal?',
        options: ['Elephant', 'Platypus', 'Crocodile', 'Bat'],
        correctAnswer: 2
      }]
    }
  }, {
    id: 'module-2',
    title: 'Wildlife Habitats and Ecosystems',
    description: 'Exploring the diverse habitats where wildlife species live.',
    content: 'This module examines various wildlife habitats around the world, ecosystem dynamics, and the relationships between wildlife and their environments.',
    videoUrl: 'https://example.com/videos/wildlife-habitats',
    assessment: {
      id: 'assessment-2',
      title: 'Habitats and Ecosystems Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'Which ecosystem has the highest biodiversity?',
        options: ['Tropical Rainforest', 'Desert', 'Tundra', 'Temperate Forest'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'What is the term for the physical area where an organism lives?',
        options: ['Habitat', 'Niche', 'Biome', 'Range'],
        correctAnswer: 0
      }]
    }
  }, {
    id: 'module-3',
    title: 'Wildlife Behavior and Adaptation',
    description: 'Understanding how wildlife species behave and adapt to their environments.',
    content: 'This module explores the behavioral patterns of different wildlife species, including feeding, mating, migration, and territorial behaviors, as well as the various adaptations that allow them to survive in their specific habitats.',
    videoUrl: 'https://example.com/videos/wildlife-behavior',
    assessment: {
      id: 'assessment-3',
      title: 'Wildlife Behavior Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'What is the term for the seasonal movement of animals over long distances?',
        options: ['Migration', 'Hibernation', 'Estivation', 'Territoriality'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'Which adaptation helps desert animals conserve water?',
        options: ['Concentrated urine', 'Webbed feet', 'Thick fur', 'Bright coloration'],
        correctAnswer: 0
      }]
    }
  }, {
    id: 'module-4',
    title: 'Wildlife Conservation Challenges',
    description: 'Examining the threats facing wildlife species and conservation efforts.',
    content: 'This module addresses the major challenges in wildlife conservation, including habitat loss, climate change, poaching, human-wildlife conflict, and invasive species, as well as strategies to address these challenges.',
    videoUrl: 'https://example.com/videos/conservation-challenges',
    assessment: {
      id: 'assessment-4',
      title: 'Conservation Challenges Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'Which is considered the greatest threat to wildlife globally?',
        options: ['Habitat loss and fragmentation', 'Climate change', 'Poaching', 'Invasive species'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'What is the IUCN Red List?',
        options: ['A global inventory of the conservation status of species', 'A list of prohibited hunting activities', 'A record of extinct species', 'A database of wildlife reserves'],
        correctAnswer: 0
      }]
    }
  }, {
    id: 'module-5',
    title: 'Wildlife Research and Monitoring',
    description: 'Learning about methods used to study and monitor wildlife populations.',
    content: 'This module covers various techniques used in wildlife research and monitoring, including tracking methods, population surveys, camera trapping, bioacoustics, genetic sampling, and the use of technology in wildlife conservation.',
    videoUrl: 'https://example.com/videos/wildlife-research',
    assessment: {
      id: 'assessment-5',
      title: 'Wildlife Research Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'What is a common method for estimating animal population size?',
        options: ['Mark-recapture technique', 'DNA sequencing', 'Satellite imaging', 'Behavioral observation'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'Which technology is commonly used to track animal movements over large areas?',
        options: ['GPS collars', 'Microscopes', 'Spectrometers', 'Centrifuges'],
        correctAnswer: 0
      }]
    }
  }]
}, {
  id: 'course-2',
  title: 'Wildlife Ecology',
  description: 'Explore the relationships between wildlife species and their environments. This course covers population dynamics, community interactions, and ecosystem processes.',
  instructorId: 'user-2',
  thumbnail: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
  modules: [{
    id: 'module-1',
    title: 'Population Dynamics',
    description: 'Understanding how wildlife populations change over time.',
    content: 'This module covers population growth models, limiting factors, carrying capacity, and the dynamics of wildlife populations in changing environments.',
    videoUrl: 'https://example.com/videos/population-dynamics',
    assessment: {
      id: 'assessment-1',
      title: 'Population Dynamics Quiz',
      timeLimit: 45,
      questions: [{
        id: 'q1',
        text: 'What is carrying capacity?',
        options: ['The maximum population size that can be supported by the environment', 'The minimum population size needed for survival', 'The rate at which a population grows', 'The number of offspring produced per female'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'Which of these is a density-dependent limiting factor?',
        options: ['Hurricane', 'Drought', 'Disease', 'Volcanic eruption'],
        correctAnswer: 2
      }]
    }
  }, {
    id: 'module-2',
    title: 'Community Ecology',
    description: 'Exploring interactions between species within communities.',
    content: 'This module examines the various interactions between species in ecological communities, including competition, predation, parasitism, mutualism, and commensalism, and how these interactions shape community structure and function.',
    videoUrl: 'https://example.com/videos/community-ecology',
    assessment: {
      id: 'assessment-2',
      title: 'Community Ecology Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'What type of interaction benefits one species while harming another?',
        options: ['Predation', 'Mutualism', 'Commensalism', 'Competition'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'What is the term for the role and position a species has in its environment?',
        options: ['Ecological niche', 'Habitat', 'Territory', 'Range'],
        correctAnswer: 0
      }]
    }
  }, {
    id: 'module-3',
    title: 'Ecosystem Processes',
    description: 'Understanding energy flow and nutrient cycling in ecosystems.',
    content: 'This module focuses on the fundamental processes that occur in ecosystems, including energy flow through food webs, primary production, decomposition, and the cycling of key nutrients such as carbon, nitrogen, and phosphorus.',
    videoUrl: 'https://example.com/videos/ecosystem-processes',
    assessment: {
      id: 'assessment-3',
      title: 'Ecosystem Processes Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'What is the primary source of energy for most ecosystems?',
        options: ['Sunlight', 'Water', 'Soil', 'Air'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'Which organisms are responsible for breaking down dead organic matter?',
        options: ['Decomposers', 'Producers', 'Herbivores', 'Carnivores'],
        correctAnswer: 0
      }]
    }
  }, {
    id: 'module-4',
    title: 'Landscape Ecology',
    description: 'Studying ecological patterns and processes across landscapes.',
    content: 'This module explores how spatial patterns in landscapes influence ecological processes, including habitat fragmentation, edge effects, corridors, and metapopulation dynamics, with implications for wildlife conservation and management.',
    videoUrl: 'https://example.com/videos/landscape-ecology',
    assessment: {
      id: 'assessment-4',
      title: 'Landscape Ecology Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'What is a habitat corridor?',
        options: ['A strip of habitat connecting otherwise isolated patches', 'A boundary between two different habitat types', 'A central area of high-quality habitat', 'A region with high species diversity'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'What is the edge effect in landscape ecology?',
        options: ['Changes in conditions at the boundary between habitat types', 'The tendency for species to prefer habitat edges', 'The gradual loss of habitat at its periphery', 'The impact of roads on wildlife movement'],
        correctAnswer: 0
      }]
    }
  }, {
    id: 'module-5',
    title: 'Wildlife Ecology in Practice',
    description: 'Applying ecological principles to wildlife management and conservation.',
    content: 'This module focuses on the practical applications of wildlife ecology in management and conservation, including habitat management, population management, reintroduction programs, and ecosystem restoration, with case studies from around the world.',
    videoUrl: 'https://example.com/videos/applied-ecology',
    assessment: {
      id: 'assessment-5',
      title: 'Applied Ecology Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'What is adaptive management in wildlife conservation?',
        options: ['A systematic approach that learns from management outcomes and improves future decisions', 'Changing management strategies based on public opinion', 'Managing wildlife to adapt to climate change', 'Allowing wildlife populations to self-regulate'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'Which of these is an example of ex-situ conservation?',
        options: ['Captive breeding programs in zoos', 'Protected areas', 'Wildlife corridors', 'Hunting regulations'],
        correctAnswer: 0
      }]
    }
  }]
}, {
  id: 'course-3',
  title: 'Habitat Management',
  description: 'Learn techniques for managing and restoring wildlife habitats. This course covers habitat assessment, planning, implementation, and monitoring of habitat management projects.',
  instructorId: 'user-2',
  thumbnail: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=725&q=80',
  modules: [{
    id: 'module-1',
    title: 'Habitat Assessment Techniques',
    description: 'Methods for evaluating wildlife habitat quality and suitability.',
    content: 'This module covers various techniques for assessing wildlife habitat, including vegetation sampling, remote sensing, GIS applications, and habitat suitability modeling.',
    videoUrl: 'https://example.com/videos/habitat-assessment',
    assessment: {
      id: 'assessment-1',
      title: 'Habitat Assessment Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'Which method is commonly used to measure vegetation cover?',
        options: ['Line-point intercept', 'Camera trapping', 'Radio telemetry', 'DNA sampling'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'What does GIS stand for in habitat assessment?',
        options: ['Geographic Information System', 'Global Inventory Survey', 'Ground Investigation Service', 'Geological Inspection Standard'],
        correctAnswer: 0
      }]
    }
  }, {
    id: 'module-2',
    title: 'Habitat Management Planning',
    description: 'Developing effective plans for habitat management projects.',
    content: 'This module focuses on the process of developing habitat management plans, including setting objectives, stakeholder engagement, resource assessment, and developing management prescriptions based on wildlife needs and habitat conditions.',
    videoUrl: 'https://example.com/videos/management-planning',
    assessment: {
      id: 'assessment-2',
      title: 'Management Planning Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'What is a key component of any habitat management plan?',
        options: ['Clear, measurable objectives', 'Complex technical language', 'Expensive equipment requirements', 'Minimal stakeholder involvement'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'Which approach to habitat management focuses on mimicking natural disturbance regimes?',
        options: ['Ecological forestry', 'Intensive agriculture', 'Urban development', 'Industrial management'],
        correctAnswer: 0
      }]
    }
  }, {
    id: 'module-3',
    title: 'Habitat Restoration Techniques',
    description: 'Methods for restoring degraded wildlife habitats.',
    content: 'This module covers various techniques used in habitat restoration, including reforestation, wetland restoration, grassland restoration, and stream restoration, with case studies of successful restoration projects from different ecosystems.',
    videoUrl: 'https://example.com/videos/habitat-restoration',
    assessment: {
      id: 'assessment-3',
      title: 'Habitat Restoration Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'Which of the following is a common challenge in wetland restoration?',
        options: ['Altered hydrology', 'Excessive shade', 'Too many predators', 'Soil compaction'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'What is often the first step in grassland restoration?',
        options: ['Removal of invasive species', 'Introducing grazing animals', 'Planting trees', 'Building water features'],
        correctAnswer: 0
      }]
    }
  }, {
    id: 'module-4',
    title: 'Habitat Management Tools and Techniques',
    description: 'Practical tools and methods used in habitat management.',
    content: 'This module examines the various tools and techniques used in habitat management, including prescribed burning, mechanical treatments, chemical treatments, grazing management, and water level manipulation, with guidance on selecting appropriate techniques for different habitat types.',
    videoUrl: 'https://example.com/videos/management-tools',
    assessment: {
      id: 'assessment-4',
      title: 'Management Tools Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'Which habitat management technique involves the controlled application of fire?',
        options: ['Prescribed burning', 'Disking', 'Herbicide application', 'Mowing'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'What is the primary purpose of water control structures in wetland management?',
        options: ['To manipulate water levels', 'To prevent flooding', 'To generate electricity', 'To filter pollutants'],
        correctAnswer: 0
      }]
    }
  }, {
    id: 'module-5',
    title: 'Monitoring and Adaptive Management',
    description: 'Evaluating the success of habitat management projects and making adjustments.',
    content: 'This module focuses on approaches to monitoring habitat management outcomes, analyzing monitoring data, evaluating project success, and implementing adaptive management to improve future management actions based on lessons learned.',
    videoUrl: 'https://example.com/videos/monitoring-management',
    assessment: {
      id: 'assessment-5',
      title: 'Monitoring and Adaptive Management Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'Why is monitoring essential in habitat management?',
        options: ['To determine if management objectives are being met', 'To satisfy funding requirements only', 'To provide employment for biologists', 'To delay further management actions'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'What is a key principle of adaptive management?',
        options: ['Learning from management outcomes to improve future decisions', 'Applying the same management approach regardless of outcomes', 'Minimizing costs at all stages', 'Focusing only on short-term results'],
        correctAnswer: 0
      }]
    }
  }]
}, {
  id: 'course-4',
  title: 'Human-Wildlife Conflict Management',
  description: 'Address the challenges of human-wildlife conflicts and develop strategies for coexistence. This course explores conflict mitigation, community engagement, and policy development.',
  instructorId: 'user-2',
  thumbnail: 'https://images.unsplash.com/photo-1581178811376-1c34a5123377?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
  modules: [{
    id: 'module-1',
    title: 'Understanding Human-Wildlife Conflicts',
    description: 'Exploring the causes and impacts of conflicts between humans and wildlife.',
    content: 'This module examines the various types of human-wildlife conflicts, their ecological and socioeconomic impacts, and the factors that contribute to conflict situations.',
    videoUrl: 'https://example.com/videos/human-wildlife-conflict',
    assessment: {
      id: 'assessment-1',
      title: 'Human-Wildlife Conflict Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'Which of the following is a common cause of human-wildlife conflict?',
        options: ['Habitat loss and fragmentation', 'Wildlife photography', 'Scientific research', 'Wildlife documentaries'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'What is the term for compensation provided to farmers for livestock lost to predators?',
        options: ['Predator payment program', 'Wildlife damage compensation', 'Livestock insurance scheme', 'Conflict resolution funding'],
        correctAnswer: 1
      }]
    }
  }, {
    id: 'module-2',
    title: 'Conflict Mitigation Strategies',
    description: 'Techniques and approaches for reducing human-wildlife conflicts.',
    content: 'This module covers various strategies used to mitigate human-wildlife conflicts, including physical barriers, deterrents, land-use planning, compensation schemes, and insurance programs, with case studies of successful mitigation efforts.',
    videoUrl: 'https://example.com/videos/conflict-mitigation',
    assessment: {
      id: 'assessment-2',
      title: 'Conflict Mitigation Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'Which of these is an example of a non-lethal deterrent for crop-raiding elephants?',
        options: ['Beehive fences', 'Electric fencing', 'Ditches', 'All of the above'],
        correctAnswer: 3
      }, {
        id: 'q2',
        text: 'What is a key advantage of community-based insurance schemes over government compensation programs?',
        options: ['Greater community ownership and faster processing of claims', 'Higher payouts', 'Less paperwork', 'Government oversight'],
        correctAnswer: 0
      }]
    }
  }, {
    id: 'module-3',
    title: 'Community Engagement and Education',
    description: 'Involving local communities in conflict management and conservation.',
    content: 'This module focuses on approaches to engaging local communities in human-wildlife conflict management, including awareness programs, environmental education, community-based natural resource management, and the integration of indigenous knowledge in conflict resolution.',
    videoUrl: 'https://example.com/videos/community-engagement',
    assessment: {
      id: 'assessment-3',
      title: 'Community Engagement Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'Why is community engagement important in human-wildlife conflict management?',
        options: ['It increases local support for conservation initiatives', 'It reduces the cost of conflict management', 'It eliminates the need for physical barriers', 'It prevents all future conflicts'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'What is a Community Conservation Area?',
        options: ['A protected area managed by local communities', 'A government-designated wildlife reserve', 'A tourist attraction', 'A research station'],
        correctAnswer: 0
      }]
    }
  }, {
    id: 'module-4',
    title: 'Policy and Legal Frameworks',
    description: 'Understanding and developing effective policies for conflict management.',
    content: 'This module examines the policy and legal frameworks that govern human-wildlife conflict management, including international conventions, national laws and policies, and local regulations, with guidance on developing effective policies that balance human needs with wildlife conservation.',
    videoUrl: 'https://example.com/videos/policy-frameworks',
    assessment: {
      id: 'assessment-4',
      title: 'Policy and Legal Frameworks Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'Which international convention addresses the trade in endangered species?',
        options: ['CITES (Convention on International Trade in Endangered Species)', 'CBD (Convention on Biological Diversity)', 'UNFCCC (UN Framework Convention on Climate Change)', 'Ramsar Convention'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'What is a key element of effective human-wildlife conflict policy?',
        options: ['Clear roles and responsibilities for different stakeholders', 'Strict prohibition of all wildlife killing', 'Centralized decision-making', 'Focus on short-term solutions'],
        correctAnswer: 0
      }]
    }
  }, {
    id: 'module-5',
    title: 'Case Studies in Human-Wildlife Conflict',
    description: 'Examining real-world examples of conflict management.',
    content: 'This module presents case studies of human-wildlife conflict management from around the world, including conflicts with large carnivores, elephants, primates, and crocodilians, analyzing the successes, failures, and lessons learned from different approaches to conflict resolution.',
    videoUrl: 'https://example.com/videos/conflict-case-studies',
    assessment: {
      id: 'assessment-5',
      title: 'Case Studies Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'Which approach has been successful in reducing lion-livestock conflict in parts of Africa?',
        options: ['Using guardian dogs and improved livestock enclosures', 'Relocating all lions to protected areas', 'Eliminating all livestock farming near lion habitat', 'Providing artificial feeding stations for lions'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'What has been a key factor in successful elephant conflict mitigation in parts of Asia?',
        options: ['Community participation and benefit-sharing from tourism', 'Complete separation of elephants and humans', 'Extensive use of electric fencing alone', 'Culling problem elephants'],
        correctAnswer: 0
      }]
    }
  }]
}, {
  id: 'course-5',
  title: 'Bushmanship',
  description: 'Develop essential skills for safely navigating and surviving in wilderness environments. This course covers navigation, tracking, field craft, and emergency survival techniques.',
  instructorId: 'user-2',
  thumbnail: 'https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
  modules: [{
    id: 'module-1',
    title: 'Navigation and Orientation',
    description: 'Learn to navigate in wilderness areas using maps, compass, and natural indicators.',
    content: 'This module covers map reading, compass use, celestial navigation, natural navigation indicators, GPS technology, and route planning in wilderness environments.',
    videoUrl: 'https://example.com/videos/wilderness-navigation',
    assessment: {
      id: 'assessment-1',
      title: 'Navigation Skills Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'Which part of a compass is used to take a bearing?',
        options: ['Direction of travel arrow', 'Magnetic needle', 'Rotating bezel', 'Base plate'],
        correctAnswer: 2
      }, {
        id: 'q2',
        text: 'What natural indicator can help determine north in the northern hemisphere?',
        options: ['Moss growth on trees', 'Direction of flowing water', 'Position of the Sun at noon', 'Shape of ant hills'],
        correctAnswer: 2
      }]
    }
  }, {
    id: 'module-2',
    title: 'Wildlife Tracking',
    description: 'Techniques for identifying and following wildlife signs in the field.',
    content: 'This module explores the art and science of wildlife tracking, including track identification, gait patterns, sign interpretation, aging tracks, and using tracking for wildlife research and monitoring.',
    videoUrl: 'https://example.com/videos/wildlife-tracking',
    assessment: {
      id: 'assessment-2',
      title: 'Tracking Skills Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'What information can you determine from a wildlife track?',
        options: ['Species, direction of travel, approximate time since passing, and behavior', 'Only the species', 'Only the direction of travel', 'Only the size of the animal'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'What is the term for the pattern of footprints left by an animal as it moves?',
        options: ['Gait', 'Spoor', 'Sign', 'Trail'],
        correctAnswer: 0
      }]
    }
  }, {
    id: 'module-3',
    title: 'Field Craft and Observation',
    description: 'Skills for moving through and observing wildlife in natural environments.',
    content: 'This module covers techniques for moving quietly and unobtrusively in natural environments, camouflage and concealment, wildlife observation methods, field sketching and note-taking, and ethical guidelines for wildlife observation.',
    videoUrl: 'https://example.com/videos/field-craft',
    assessment: {
      id: 'assessment-3',
      title: 'Field Craft Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'Why is it important to stay downwind when observing wildlife?',
        options: ['Many animals have a keen sense of smell and can detect human scent', 'It prevents sunburn', 'It makes photography easier', 'It improves radio communication'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'What is the fox walk technique used in field craft?',
        options: ['A quiet walking method where you place the outside of your foot down first', 'A method of tracking foxes', 'A way to mark territory', 'A technique for climbing trees'],
        correctAnswer: 0
      }]
    }
  }, {
    id: 'module-4',
    title: 'Wilderness Survival',
    description: 'Essential skills for surviving emergency situations in the wild.',
    content: 'This module covers wilderness survival priorities, shelter construction, fire making, water procurement and purification, wild food identification, emergency signaling, and first aid in remote settings.',
    videoUrl: 'https://example.com/videos/wilderness-survival',
    assessment: {
      id: 'assessment-4',
      title: 'Survival Skills Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'What is the Rule of Threes in survival situations?',
        options: ['You can survive 3 minutes without air, 3 hours without shelter in harsh conditions, 3 days without water, and 3 weeks without food', 'You should always have 3 ways to start a fire, 3 ways to purify water, and 3 ways to signal for help', 'You should check for dangers in 3 directions before setting up camp', 'You need 3 liters of water per day in a survival situation'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'Which of these is most important in a wilderness survival situation?',
        options: ['Maintaining a positive mental attitude', 'Finding food', 'Building a permanent shelter', 'Signaling for help immediately'],
        correctAnswer: 0
      }]
    }
  }, {
    id: 'module-5',
    title: 'Field Equipment and Planning',
    description: 'Selecting and using appropriate equipment for field work and wilderness travel.',
    content: 'This module covers selection, use, and maintenance of field equipment, including clothing, footwear, optics, camping gear, research equipment, and field safety planning, risk assessment, and emergency protocols.',
    videoUrl: 'https://example.com/videos/field-equipment',
    assessment: {
      id: 'assessment-5',
      title: 'Equipment and Planning Quiz',
      timeLimit: 30,
      questions: [{
        id: 'q1',
        text: 'What is the most important consideration when selecting field clothing?',
        options: ['Appropriate layering system for the environment', 'Brand name', 'Fashion trends', 'Bright colors'],
        correctAnswer: 0
      }, {
        id: 'q2',
        text: 'What should always be included in a field safety plan?',
        options: ['Emergency contact information and procedures', 'Gourmet meal recipes', 'Entertainment options', 'Social media posting schedule'],
        correctAnswer: 0
      }]
    }
  }]
}];
// Mock student progress data
export const mockStudentProgress = [{
  userId: 'user-3',
  courseId: 'course-1',
  progress: {
    'module-1': {
      completed: true,
      assessmentScore: 80,
      lastAccessed: '2023-05-15T10:30:00Z'
    },
    'module-2': {
      completed: false,
      assessmentScore: null,
      lastAccessed: '2023-05-16T14:20:00Z'
    }
  }
}];