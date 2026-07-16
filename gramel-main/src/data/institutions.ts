export interface Institution {
  image: string;
  alt: string;
  university: string;
  description: string;
}

export const institutionsByCountry: Record<string, Institution[]> = {
  "United States": [
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Best_Hall%2C_Arizona_State_University%2C_Forest_Avenue%2C_Tempe%2C_AZ.jpg/1280px-Best_Hall%2C_Arizona_State_University%2C_Forest_Avenue%2C_Tempe%2C_AZ.jpg",
      alt: "Best Hall at Arizona State University",
      university: "Arizona State University",
      description:
        "Renowned for innovation and entrepreneurship, ASU has flexible programs, global campuses, and strong pathways for STEM, business, and creative disciplines.",
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/University_of_Southern_California_Capital_Campus.jpg/1280px-University_of_Southern_California_Capital_Campus.jpg",
      alt: "University of Southern California campus",
      university: "University of Southern California",
      description:
        "A leading research university with standout programs in film, business, and engineering, offering deep industry connections across the West Coast.",
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Physics_Building_Purdue_University_2016_01.jpg/1280px-Physics_Building_Purdue_University_2016_01.jpg",
      alt: "Physics Building at Purdue University",
      university: "Purdue University",
      description:
        "A top public research university known for engineering, computer science, and aviation, with a large, welcoming international student community.",
    },
  ],
  Canada: [
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Medical_Science_Building_at_the_University_of_Toronto.JPG/1280px-Medical_Science_Building_at_the_University_of_Toronto.JPG",
      alt: "Medical Science Building at the University of Toronto",
      university: "University of Toronto",
      description:
        "A top-ranked global university known for research excellence, diverse student life, and strong academic programs in engineering, business, health sciences, and humanities.",
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Iona_Building%2C_University_of_British_Columbia.jpg/1280px-Iona_Building%2C_University_of_British_Columbia.jpg",
      alt: "Iona Building at the University of British Columbia",
      university: "University of British Columbia",
      description:
        "Set in Vancouver, UBC pairs world-class research with a stunning campus, offering strong programs in science, business, and the arts.",
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Elizabeth_Wirth_Music_Building%2C_McGill_University%2C_Sep_06_2022.jpg/1280px-Elizabeth_Wirth_Music_Building%2C_McGill_University%2C_Sep_06_2022.jpg",
      alt: "Elizabeth Wirth Music Building at McGill University",
      university: "McGill University",
      description:
        "One of Canada's most prestigious institutions, McGill offers rigorous academics and a vibrant, multicultural campus life in Montreal.",
    },
  ],
  Germany: [
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/TU_M%C3%BCnchen_Garching_-_Institute_for_Advanced_Study.jpg/1280px-TU_M%C3%BCnchen_Garching_-_Institute_for_Advanced_Study.jpg",
      alt: "Technical University of Munich, Garching campus",
      university: "Technical University of Munich",
      description:
        "A top European institution for engineering and technology, offering low-cost, high-quality education with strong industry partnerships.",
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Campus_Altstadt%2C_Universit%C3%A4tsplatz_Heidelberg_Augustinergasse_Durchblick_zum_Marsiliusplatz.jpg/1280px-Campus_Altstadt%2C_Universit%C3%A4tsplatz_Heidelberg_Augustinergasse_Durchblick_zum_Marsiliusplatz.jpg",
      alt: "Heidelberg University's old town campus",
      university: "Heidelberg University",
      description:
        "Germany's oldest university, combining centuries of academic tradition with cutting-edge research across sciences and humanities.",
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/2022_Aachen%2C_W%C3%BCllnerstrasse%2C_RWTH_%2807%29.jpg/1280px-2022_Aachen%2C_W%C3%BCllnerstrasse%2C_RWTH_%2807%29.jpg",
      alt: "RWTH Aachen University building",
      university: "RWTH Aachen University",
      description:
        "A leading technical university known for engineering and applied sciences, with close ties to Germany's industrial sector.",
    },
  ],
  Australia: [
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Old_Arts_Building._Parkville_Campus_of_University_of_Melbourne_%28cropped%29.JPG/1280px-Old_Arts_Building._Parkville_Campus_of_University_of_Melbourne_%28cropped%29.JPG",
      alt: "Old Arts Building at the University of Melbourne",
      university: "University of Melbourne",
      description:
        "Consistently ranked among the world's best, Melbourne offers outstanding research opportunities and a lively, student-friendly city.",
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/SydneyUniversity_MainQuadrangle_panorama_270.jpg/1280px-SydneyUniversity_MainQuadrangle_panorama_270.jpg",
      alt: "Main Quadrangle at the University of Sydney",
      university: "University of Sydney",
      description:
        "A historic, globally respected university offering strong programs in law, medicine, business, and the arts in the heart of Sydney.",
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Religious_Centre%2C_Monash_University.jpg/1280px-Religious_Centre%2C_Monash_University.jpg",
      alt: "Monash University Clayton campus",
      university: "Monash University",
      description:
        "Australia's largest university, known for innovation, research strength, and flexible study options across multiple campuses.",
    },
  ],
  Ireland: [
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/3/35/Trinity_College%2C_Dublin_-_geograph.org.uk_-_1080717.jpg",
      alt: "Trinity College Dublin campus",
      university: "Trinity College Dublin",
      description:
        "Ireland's oldest and most prestigious university, offering a historic campus, strong academics, and an internationally diverse student body.",
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/7/77/University_College_Dublin_campus_-_geograph.org.uk_-_1627462.jpg",
      alt: "University College Dublin campus",
      university: "University College Dublin",
      description:
        "Ireland's largest university, with strong programs in business, engineering, and technology, and close links to major employers.",
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/County_Galway_-_NUI_Galway_-_20180512103033.jpg/1280px-County_Galway_-_NUI_Galway_-_20180512103033.jpg",
      alt: "University of Galway campus",
      university: "National University of Ireland Galway",
      description:
        "A research-driven university on the west coast of Ireland, offering a close-knit community and strong programs in science and the arts.",
    },
  ],
  "New Zealand": [
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/00_0495_Clock_Tower%2C_University_of_Auckland.jpg/1280px-00_0495_Clock_Tower%2C_University_of_Auckland.jpg",
      alt: "Clock Tower at the University of Auckland",
      university: "University of Auckland",
      description:
        "New Zealand's top-ranked university, offering strong research programs and a vibrant, multicultural city campus.",
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/8/8d/University_of_Otago_ClockTower_Building_1879.jpg",
      alt: "Clocktower Building at the University of Otago",
      university: "University of Otago",
      description:
        "New Zealand's oldest university, known for its close-knit campus community and strengths in health sciences and the humanities.",
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Victoria_University_of_Wellington_Kelburn_Campus_01.jpg/1280px-Victoria_University_of_Wellington_Kelburn_Campus_01.jpg",
      alt: "Victoria University of Wellington, Kelburn campus",
      university: "Victoria University of Wellington",
      description:
        "Located in the capital, Victoria University offers strong programs in law, government, and the arts, with easy access to industry and policy work.",
    },
  ],
};
