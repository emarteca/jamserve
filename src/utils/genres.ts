let GenresSlugs: { [slug: string]: string }; // will be build on first use

const genreByNumbers = [
	'Blues',
	'Classic Rock',
	'Country',
	'Dance',
	'Disco',
	'Funk',
	'Grunge',
	'Hip Hop',
	'Jazz',
	'Metal',
	'New Age',
	'Oldies',
	'Other',
	'Pop',
	'R&B',
	'Rap',
	'Reggae',
	'Rock',
	'Techno',
	'Industrial',
	'Alternative',
	'Ska',
	'Death Metal',
	'Pranks',
	'Soundtrack',
	'Euro-Techno',
	'Ambient',
	'Trip-Hop',
	'Vocal',
	'Jazz+Funk',
	'Fusion',
	'Trance',
	'Classical',
	'Instrumental',
	'Acid',
	'House',
	'Game',
	'Sound Clip',
	'Gospel',
	'Noise',
	'Alternative Rock',
	'Bass',
	'Soul',
	'Punk',
	'Space',
	'Meditative',
	'Instrumental Pop',
	'Instrumental Rock',
	'Ethnic',
	'Gothic',
	'Darkwave',
	'Techno-Industrial',
	'Electronic',
	'Pop-Folk',
	'Eurodance',
	'Dream',
	'Southern Rock',
	'Comedy',
	'Cult',
	'Gangsta Rap',
	'Top 40',
	'Christian Rap',
	'Pop-Funk',
	'Jungle',
	'Native American',
	'Cabaret',
	'New Wave',
	'Psychedelic',
	'Rave',
	'Showtunes',
	'Trailer',
	'Lo-Fi',
	'Tribal',
	'Acid Punk',
	'Acid Jazz',
	'Polka',
	'Retro',
	'Musical',
	'Rock & Roll',
	'Hard Rock',
	'Folk',
	'Folk-Rock',
	'National Folk',
	'Swing',
	'Fast Fusion',
	'Bebop',
	'Latin',
	'Revival',
	'Celtic',
	'Bluegrass',
	'Avantgarde',
	'Gothic Rock',
	'Progressive Rock',
	'Psychedelic Rock',
	'Symphonic Rock',
	'Slow Rock',
	'Big Band',
	'Chorus',
	'Easy Listening',
	'Acoustic',
	'Humour',
	'Speech',
	'Chanson',
	'Opera',
	'Chamber Music',
	'Sonata',
	'Symphony',
	'Booty Bass',
	'Primus',
	'Porn Groove',
	'Satire',
	'Slow Jam',
	'Club',
	'Tango',
	'Samba',
	'Folklore',
	'Ballad',
	'Power Ballad',
	'Rhythmic Soul',
	'Freestyle',
	'Duet',
	'Punk Rock',
	'Drum Solo',
	'A Cappella',
	'Euro-House',
	'Dance Hall',
	'Goa',
	'Drum & Bass',
	'Club-House',
	'Hardcore',
	'Terror',
	'Indie',
	'BritPop',
	'Weltmusik',
	'Polsk Punk',
	'Beat',
	'Christian Gangsta Rap',
	'Heavy Metal',
	'Black Metal',
	'Crossover',
	'Contemporary Christian',
	'Christian Rock',
	'Merengue',
	'Salsa',
	'Thrash Metal',
	'Anime',
	'JPop',
	'Synthpop',
	'Abstract',
	'Art Rock',
	'Baroque',
	'Bhangra',
	'Big Beat',
	'Breakbeat',
	'Chillout',
	'Downtempo',
	'Dub',
	'EBM',
	'Eclectic',
	'Electro',
	'Electroclash',
	'Emo',
	'Experimental',
	'Garage',
	'Global',
	'IDM',
	'Illbient',
	'Industro-Goth',
	'Jam Band',
	'Krautrock',
	'Leftfield',
	'Lounge',
	'Math Rock',
	'New Romantic',
	'Nu-Breakz',
	'Post-Punk',
	'Post-Rock',
	'Psytrance',
	'Shoegaze',
	'Space Rock',
	'Trop Rock',
	'World Music',
	'Neoclassical',
	'Audiobook',
	'Audio Theatre',
	'Neue Deutsche Welle',
	'Podcast',
	'Indie Rock',
	'G-Funk',
	'Dubstep',
	'Garage Rock',
	'Psybient'];

export const Genres: Array<string> = [
	'2 Tone',
	'2-Step Garage',
	'4-Beat',
	'A Cappella',
	'Abstract',
	'Acid',
	'Acid Breaks',
	'Acid House',
	'Acid Jazz',
	'Acid Punk',
	'Acid Rock',
	'Acid Techno',
	'Acid Trance',
	'Acousmatic Music',
	'Acoustic',
	'Adult Contemporary',
	'African',
	'African Blues',
	'African Heavy Metal',
	'African Hip Hop',
	'Afro / Cosmic Disco',
	'Afro-Cuban Jazz',
	'Afrobeat',
	'Aggrotech',
	'Alternative',
	'Alternative Country',
	'Alternative Dance',
	'Alternative Hip Hop',
	'Alternative Metal',
	'Alternative Rock',
	'Ambient',
	'Ambient Dub',
	'Ambient House',
	'American Folk Revival',
	'Americana',
	'Anarcho Punk',
	'Anime',
	'Anti-folk',
	'Apala',
	'Arab Pop',
	'Art Punk',
	'Art Rock',
	'Asian',
	'Asian American Jazz',
	'Asian Underground',
	'Atlanta Hip Hop',
	'Audio Theatre',
	'Audio Drama',
	'Audiobook',
	'Australian Country Music',
	'Australian Hip Hop',
	'AustroPop',
	'Avant-garde',
	'Avant-garde Jazz',
	'Avant-garde Metal',
	'Avantgarde',
	'Axé',
	'Bachata',
	'Background Music',
	'Baila',
	'Baithak Gana',
	'Bakersfield sound',
	'Balearic Beat',
	'Balearic Trance',
	'Ballad',
	'Baltimore Club',
	'Banda',
	'Baroque',
	'Baroque Pop',
	'Bass',
	'Bassline',
	'Baul',
	'Beat',
	'Beat Music',
	'Beautiful Music',
	'Bebop',
	'Benga',
	'Berlin School',
	'Bhangra',
	'Big Band',
	'Big Beat',
	'Big Room',
	'Bikutsi',
	'BitPop',
	'Black Metal',
	'Blue-Eyed Soul',
	'Bluegrass',
	'Blues',
	'Blues Country',
	'Blues Rock',
	'Blues Shouter',
	'Bolero',
	'Bongo Flava',
	'Boogie',
	'Boogie-Woogie',
	'Booty Bass',
	'Bossa Nova',
	'Bounce Music',
	'Bouncy House',
	'Bouncy Techno',
	'Bouyon',
	'Brazilian',
	'Brazilian Rock',
	'Breakbeat',
	'Breakbeat Hardcore',
	'Breakcore',
	'Breakstep',
	'Brega',
	'Brick City club',
	'Brill Building',
	'British Blues',
	'British Dance Band',
	'British Folk revival',
	'British Hip Hop',
	'BritPop',
	'Broken Beat',
	'Brostep',
	'Bubblegum Dance',
	'Bubblegum Pop',
	'Bullerengue',
	'C-Pop',
	'Cabaret',
	'Cadence-lypso',
	'Cajun',
	'Cajun fiddle tunes',
	'Calypso',
	'Canadian Blues',
	'Canción',
	'Canterbury scene',
	'Canzone',
	'Cape Jazz',
	'Caribbean',
	'Celtic',
	'Celtic Metal',
	'Celtic Music',
	'Celtic Punk',
	'Cha Cha Cha',
	'Chalga',
	'Chamber Jazz',
	'Chamber Music',
	'Chanson',
	'Chap Hop',
	'Chicago Blues',
	'Chicago Hip Hop',
	'Chicago House',
	'Chicano Rap',
	'Chicha',
	'Chill-out',
	'Chillout',
	'Chillstep',
	'Chillwave',
	'Chimurenga',
	'Chinese Rock',
	'Chiptune',
	'Chopped & Screwed',
	'Choro',
	'Chorus',
	'Christian Country Music',
	'Christian Gangsta Rap',
	'Christian Hip Hop',
	'Christian Metal',
	'Christian Pop',
	'Christian Punk',
	'Christian Rap',
	'Christian Rock',
	'Chutney',
	'Chutney soca',
	'Classic Country',
	'Classic female Blues',
	'Classic Rock',
	'Classical',
	'Classical crossover',
	'Close harmony',
	'Club',
	'Club-House',
	'Coldwave',
	'Comedy',
	'Compas',
	'Complextro',
	'Congolese rumba',
	'Conscious Hip Hop',
	'Contemporary Christian',
	'Contemporary Folk',
	'Contemporary R&B',
	'Continental Jazz',
	'Cool Jazz',
	'Country',
	'Country Blues',
	'Country Pop',
	'Country Rap',
	'Country Rock',
	'Country-Rap',
	'Coupé-Décalé',
	'Western Music',
	'CowPunk',
	'Criolla',
	'Crossover',
	'Crossover Jazz',
	'Crossover Thrash',
	'Crunk',
	'Crunkcore',
	'Crust Punk',
	'Crustgrind',
	'Cult',
	'Cumbia',
	'Cumbia Rap',
	'Cybergrind',
	'D-beat',
	'Dance',
	'Dance Hall',
	'Dance-Pop',
	'Dance-Punk',
	'Dance-Rock',
	'Dancehall',
	'Dancehall Music',
	'Dangdut',
	'Dansband Music',
	'Dark Ambient',
	'Dark Cabaret',
	'Dark Electro',
	'Dark Wave',
	'Darkcore',
	'Darkcore jungle',
	'Darkstep',
	'Darkwave',
	'Death \'n\' roll',
	'Death industrial',
	'Death Metal',
	'Death-Doom',
	'Deathcore',
	'DeathRock',
	'Deep Funk',
	'Deep House',
	'Delta Blues',
	'Desert Rock',
	'Detroit Blues',
	'Detroit Hip Hop',
	'Detroit Techno',
	'Digital hardcore',
	'Disco',
	'Disco polo',
	'Diva House',
	'Dixieland',
	'Djent',
	'Doom Metal',
	'Doomcore',
	'Downtempo',
	'Dream',
	'Dream Pop',
	'Dream Trance',
	'Drill',
	'Drill & Bass',
	'Drone Metal',
	'Drone Music',
	'Drum & Bass',
	'Drum Solo',
	'Drumstep',
	'Dub',
	'Dub Techno',
	'Dubstep',
	'Dubstyle',
	'Dubtronica',
	'Duet',
	'Dunedin Sound',
	'Dutch House',
	'East Coast Hip Hop',
	'Easy Listening',
	'EBM',
	'Eclectic',
	'Electric Blues',
	'Electro',
	'Electro House',
	'Electro Music',
	'Electro Swing',
	'Electro-Industrial',
	'Electroacoustic',
	'Electroacoustic Music',
	'Electroclash',
	'Electronic',
	'Electronic Body Music',
	'Electronic Rock',
	'Electronica',
	'Electronicore',
	'ElectroPop',
	'ElectroPunk',
	'Elevator Music',
	'Emo',
	'Ethereal Wave',
	'Ethnic',
	'Ethnic electronica',
	'Ethno Jazz',
	'Euro Disco',
	'Euro-House',
	'Euro-Techno',
	'Eurobeat',
	'Eurodance',
	'European free Jazz',
	'EuroPop',
	'Experimental',
	'Experimental Hip Hop',
	'Experimental Music',
	'Experimental Rock',
	'Fado',
	'Fann at-Tanbura',
	'Fast Fusion',
	'Fidget House',
	'Fijiri',
	'Filk Music',
	'Filmi',
	'Flamenco',
	'Florida Breaks',
	'Folk',
	'Folk Metal',
	'Folk Pop',
	'Folk Punk',
	'Folk Rock',
	'Folk-Rock',
	'Folklore',
	'Folktronica',
	'Forró',
	'Franco-Country',
	'Freak Folk',
	'Freakbeat',
	'Free Funk',
	'Free Improvisation',
	'Free Jazz',
	'Free Tekno',
	'Freestyle',
	'Freestyle Music',
	'Freestyle Rap',
	'French House',
	'French Pop',
	'Frevo',
	'Fuji Music',
	'Full On',
	'Funk',
	'Funk Carioca',
	'Funk Metal',
	'Funkstep',
	'Funktronica',
	'Funky House',
	'Furniture Music',
	'Fusion',
	'Future Garage',
	'Future House',
	'FuturePop',
	'G-Funk',
	'Gabba',
	'Game',
	'Game Boy Music',
	'Gamelan',
	'Gangsta Rap',
	'Garage',
	'Garage House',
	'Garage Punk',
	'Garage Rock',
	'Genge',
	'Ghetto House',
	'Ghettotech',
	'Glam Metal',
	'Glam Rock',
	'Glitch',
	'Glitch Hop',
	'Global',
	'Go-go',
	'Goa',
	'Goa Trance',
	'Golden Age Hip Hop',
	'Goregrind',
	'Gospel',
	'Gospel Blues',
	'Gothic',
	'Gothic Metal',
	'Gothic Rock',
	'Grime',
	'Grindcore',
	'Grindie',
	'Groove Metal',
	'Grunge',
	'Grupera',
	'Guajira',
	'Gypsy Jazz',
	'Gypsy Punk',
	'Happy Hardcore',
	'Hard Bop',
	'Hard House',
	'Hard NRG',
	'Hard Rock',
	'Hard Trance',
	'Hardbag',
	'Hardcore',
	'Hardcore Rap',
	'Hardcore Hip Hop',
	'Hardcore Punk',
	'Hardstep',
	'Hardstyle',
	'Heavy Metal',
	'Hellbilly Music',
	'Hi-NRG',
	'Highlife',
	'Hill Country Blues',
	'Hip Hop',
	'Hip Hop Soul',
	'Hip House',
	'Hip Pop',
	'Hip Hop',
	'Hiplife',
	'Hokum',
	'Hokum Blues',
	'Honky Tonk',
	'Horror Punk',
	'Horrorcore',
	'House',
	'House Music',
	'Houston Hip Hop',
	'Huayno',
	'Humour',
	'Hyphy',
	'IDM',
	'Igbo highlife',
	'Igbo Rap',
	'Illbient',
	'Indian Pop',
	'Indie',
	'Indie Folk',
	'Indie Pop',
	'Indie Rock',
	'Indietronica',
	'Industrial',
	'Industrial Folk',
	'Industrial Hip Hop',
	'Industrial Metal',
	'Industrial Music',
	'Industrial Rock',
	'Industro-Goth',
	'Instrumental',
	'Instrumental Country',
	'Instrumental Hip Hop',
	'Instrumental Pop',
	'Instrumental Rock',
	'Iranian Pop',
	'Isicathamiya',
	'Isolationism',
	'Italo Dance',
	'Italo Disco',
	'Italo House',
	'J-Pop',
	'Jam Band',
	'Jangle Pop',
	'Japanoise',
	'Jazz',
	'Jazz Blues',
	'Jazz Fusion',
	'Jazz House',
	'Jazz Rap',
	'Jazz Rock',
	'Jazz-Funk',
	'Jazz+Funk',
	'Jerkin\'',
	'Jersey Club',
	'Jit',
	'JPop',
	'Jùjú',
	'Jump Blues',
	'Jump-up',
	'Jumpstyle',
	'Jungle',
	'K-Pop',
	'Kadongo Kamu',
	'Kansas City Blues',
	'Kansas City Jazz',
	'Kapuka',
	'Keroncong',
	'Khaliji',
	'Kizomba',
	'Krautrock',
	'Kuduro',
	'Kwaito',
	'Kwassa Kwassa',
	'Kwela',
	'Laïkó',
	'Lambada',
	'Laptronica',
	'Latin',
	'Latin alternative',
	'Latin ballad',
	'Latin Christian',
	'Latin House',
	'Latin Jazz',
	'Latin Metal',
	'Latin Pop',
	'Latin Rock',
	'Latin Swing',
	'Lavani',
	'Leftfield',
	'Lento Violento',
	'Liquid Dubstep',
	'Liquid Funk',
	'Livetronica',
	'Liwa',
	'Lo-fi',
	'Lo-Fi',
	'Louisiana Blues',
	'Louisiana Swamp Pop',
	'Lounge',
	'Lounge Music',
	'Lovers Rock',
	'Low Bap',
	'Lowercase',
	'Luk Krung',
	'Luk Thung',
	'Lyrical Hip Hop',
	'M-Base',
	'Mafioso Rap',
	'Mainstream Jazz',
	'Mákina',
	'Makossa',
	'Maloya',
	'Mambo',
	'MandoPop',
	'Manila Sound',
	'Maracatu',
	'Mariachi',
	'Marrabenta',
	'Math Rock',
	'Mathcore',
	'Mbalax',
	'Mbaqanga',
	'Mbube',
	'Medieval Metal',
	'Meditative',
	'Melbourne Bounce',
	'Melodic Death Metal',
	'Melodic Metalcore',
	'Memphis Blues',
	'Merengue',
	'MerenRap',
	'Méringue',
	'Metal',
	'Metalcore',
	'Mexican Pop',
	'Mexican Son',
	'Miami Bass',
	'Microhouse',
	'Middle of the road',
	'Midwest Hip Hop',
	'Minimal Techno',
	'Minimal Wave',
	'Modal Jazz',
	'Moombahcore',
	'Moombahton',
	'Morlam',
	'Morna',
	'Mosambique',
	'Motswako',
	'Música Criolla',
	'Música Popular Brasileira',
	'Música Sertaneja',
	'Musical',
	'Musique Concrète',
	'Nagoya Kei',
	'Nashville Sound',
	'National Folk',
	'Native American',
	'NDW',
	'Ndombolo',
	'NederPop',
	'Neo Soul',
	'Neo-Bop Jazz',
	'Neo-Psychedelia',
	'Neo-Swing',
	'Neoclassical',
	'Neoclassical Metal',
	'Neofolk',
	'Neotraditional Country',
	'Nerdcore',
	'Neue Deutsche Welle',
	'NeuroFunk',
	'Neurohop',
	'New Age',
	'New Beat',
	'New jack swing',
	'New Jersey Hip Hop',
	'New Prog',
	'New Rave',
	'New Romantic',
	'New Romanticism',
	'New School Hip Hop',
	'New Wave',
	'New-age Music',
	'Nintendocore',
	'Nitzhonot',
	'No wave',
	'Noise',
	'Noise Rock',
	'Noisegrind',
	'Nortec',
	'Norteño',
	'Northern Soul',
	'Novelty Ragtime',
	'Nu Jazz',
	'Nu Metal',
	'Nu Skool Breaks',
	'Nu-Breakz',
	'Nu-Disco',
	'Nu-Funk',
	'Nu-Gaze',
	'Nu-NRG',
	'Nueva canción',
	'Old School Hip Hop',
	'Oldies',
	'Opera',
	'Operatic Pop',
	'Orchestral Jazz',
	'Original Pilipino Music',
	'Other',
	'Outlaw Country',
	'Outsider House',
	'P-Funk',
	'Pagan Metal',
	'Pagode',
	'Paisley Underground',
	'Palm-wine',
	'Piedmont Blues',
	'Pinoy Pop',
	'Podcast',
	'Political Hip Hop',
	'Polka',
	'Polsk Punk',
	'Pop',
	'Pop Punk',
	'Pop Rap',
	'Pop Rock',
	'Pop Soul',
	'Pop Sunda',
	'Pop-Folk',
	'Pop-Funk',
	'Porn Groove',
	'Porro',
	'Post-Bop',
	'Post-Disco',
	'Post-Grunge',
	'Post-Hardcore',
	'Post-Metal',
	'Post-Punk',
	'Post-Punk Revival',
	'Post-Rock',
	'Power Ballad',
	'Power Electronics',
	'Power Metal',
	'Power Noise',
	'Power Pop',
	'Powerviolence',
	'Pranks',
	'Primus',
	'Progressive Bluegrass',
	'Progressive Country',
	'Progressive Folk',
	'Progressive House',
	'Progressive Metal',
	'Progressive Pop',
	'Progressive Rock',
	'Progressive Trance',
	'Protest Song',
	'Psybient',
	'Psychedelic',
	'Psychedelic Folk',
	'Psychedelic Pop',
	'Psychedelic Rock',
	'Psychedelic Trance',
	'Psychobilly',
	'Punkabilly',
	'Psytrance',
	'Punk',
	'Punk Blues',
	'Punk Jazz',
	'Punk Rock',
	'Punta',
	'Punta Rock',
	'R&B',
	'Raga Rock',
	'Ragga',
	'Ragga Jungle',
	'Raggacore',
	'Ragini',
	'Ragtime',
	'Raï',
	'Ranchera',
	'Rap',
	'Rap Metal',
	'Rap Music',
	'Rap Opera',
	'Rap Rock',
	'Rapcore',
	'Rara tech',
	'Rasin',
	'Rave',
	'Reactionary Bluegrass',
	'Rebetiko',
	'Red Dirt',
	'Reggae',
	'Reggae Español',
	'Spanish Reggae',
	'Reggae Fusion',
	'Reggaestep',
	'Reggaeton',
	'Regional Mexican',
	'Retro',
	'Revival',
	'Rhythm & Blues',
	'Rhythmic Soul',
	'Riot grrrl',
	'Rock',
	'Rock & Roll',
	'Rock en Español',
	'Rock in Opposition',
	'Rockabilly',
	'Rocksteady',
	'Rumba',
	'Russian Pop',
	'Sadcore',
	'Sakara',
	'Salsa',
	'Salsa romántica',
	'Samba',
	'Samba Rock',
	'Sambass',
	'Satire',
	'Sawt',
	'Schlager',
	'Screamo',
	'Sega',
	'Seggae',
	'Semba',
	'Sertanejo',
	'Shangaan electro',
	'Shibuya-kei',
	'Shoegaze',
	'Showtunes',
	'Singer-songwriter',
	'Ska',
	'Ska Jazz',
	'Ska Punk',
	'Skate Punk',
	'Skiffle',
	'Skweee',
	'Slow Jam',
	'Slow Rock',
	'Slowcore',
	'Sludge Metal',
	'Smooth Jazz',
	'Snap Music',
	'Soca',
	'Soft Rock',
	'Son',
	'Son Cubano',
	'Sonata',
	'Songo',
	'Songo-Salsa',
	'Sophisti-Pop',
	'Soukous',
	'Soul',
	'Soul Blues',
	'Soul Jazz',
	'Sound Clip',
	'Soundtrack',
	'Southern Hip Hop',
	'Southern Rock',
	'Southern Soul',
	'Space',
	'Space Age Pop',
	'Space Disco',
	'Space Music',
	'Space Rock',
	'Speech',
	'Speed garage',
	'Speed Metal',
	'Speedcore',
	'St.Louis Blues',
	'St.Louis Hip Hop',
	'Stoner Rock',
	'Straight-ahead Jazz',
	'Street Punk',
	'Stride Jazz',
	'Sufi Rock',
	'SungPoetry',
	'Sunshine Pop',
	'Suomisaundi',
	'Surf Pop',
	'Surf Rock',
	'Swamp Blues',
	'Swing',
	'Symphonic black Metal',
	'Symphonic Metal',
	'Symphonic Rock',
	'Symphony',
	'Synthpop',
	'SynthPop',
	'Synthwave',
	'Taarab',
	'Tango',
	'Tech House',
	'Tech Trance',
	'Techdombe',
	'Technical death Metal',
	'Techno',
	'Techno-Industrial',
	'Techstep',
	'Tecno Brega',
	'Tecnobrega',
	'Teen Pop',
	'Tejano',
	'Terror',
	'Texas Blues',
	'Texas Country',
	'Thai Pop',
	'Third stream',
	'Thrash Metal',
	'Thrashcore',
	'Timba',
	'Top 40',
	'Trad Jazz',
	'Traditional Country Music',
	'Traditional Pop Music',
	'Trailer',
	'Trance',
	'Trance Music',
	'TRap',
	'TRapstep',
	'Tribal',
	'Tribal House',
	'Trip hop',
	'Trip-Hop',
	'Trival',
	'Trop Rock',
	'Tropical',
	'Tropical House',
	'Tropicalia',
	'TropiPop',
	'Truck-driving Country',
	'Turkish Pop',
	'Turntablism',
	'Twin Cities Hip Hop',
	'Twoubadou',
	'UK Funky',
	'UK Garage',
	'UK Hardcore',
	'Unblack Metal',
	'Underground Hip Hop',
	'Uplifting Trance',
	'Urban Pasifika',
	'V-Pop',
	'Vallenato',
	'Vaporwave',
	'Video game Music',
	'Viking Metal',
	'VisPop',
	'Visual Kei',
	'Vocal',
	'Vocal Jazz',
	'Vocal Trance',
	'War Metal',
	'Weltmusik',
	'West Coast Blues',
	'West Coast Hip Hop',
	'West Coast Jazz',
	'Western swing',
	'Witch House',
	'Wonky',
	'Wonky Pop',
	'World Fusion',
	'World Music',
	'Worldbeat',
	'Zouglou',
	'Zouk',
	'Zouk-Lambada',
	'Zydeco'
];

function slugify(genre: string): string {
	return genre.replace(/[& \-\.]/g, '').toLowerCase();
}

export function getKnownGenre(genre: string): string | undefined {
	const slug = slugify(genre);
	if (!GenresSlugs) {
		GenresSlugs = {};
		Genres.forEach(g => {
			GenresSlugs[slugify(g)] = g;
		});
	}
	return GenresSlugs[slug];
}

export function cleanGenre(genre: string): string {
	const results: Array<string> = [];
	const parts = genre.split('/');
	parts.forEach((part: string) => {
		// test for (number)
		part = part.trim();
		const numpart = /\((\d+)\)/.exec(part);
		let num: number | undefined;
		if (numpart) {
			num = parseInt(numpart[1], 10);
			part = part.slice(0, numpart.index) + part.slice(numpart.index + numpart[0].length);
		}
		if (part.length === 0 && (num !== undefined)) {
			const s = genreByNumbers[num];
			if (s) {
				part = s;
			}
		}
		if (part.length > 0) {
			const slug = slugify(part);
			let result: string | undefined;
			if (!GenresSlugs) {
				GenresSlugs = {};
				Genres.forEach(g => {
					GenresSlugs[slugify(g)] = g;
				});
			}
			if (GenresSlugs && GenresSlugs[slug]) {
				result = GenresSlugs[slug];
			}
			if (!result && part.includes(' & ')) {
				const subParts = part.split('&');
				subParts.forEach(sub => {
					sub = cleanGenre(sub);
					if (!results.includes(sub)) {
						results.push(sub);
					}
				});
			} else if (result) {
				if (!results.includes(result)) {
					results.push(result);
				}
			} else {
				if (!results.includes(part)) {
					results.push(part);
				}
			}
		}
	});
	return results.join(' / ');
}
