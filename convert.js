const path = require("path");
const glob = require("glob");
const child_process = require("child_process");
const options = {
	glob: "/srv/mythtv/plex/**/*.ts",
	max: 1,
}


const files = glob.sync(options.glob);
const max = options.max || files.length;
files
	.slice(0, max)
	.map(encode);

function encode(file) {
	const npath = path.parse(file);
	delete npath.base;
	npath.ext = ".mp4";
	const result = child_process.spawnSync(`ffmpeg -y -i ${file} -c:v libx264 -preset ultrafast -crf 25 -ac 2 -c:a aac -b:a 128k -movflags +faststart -strict -2 ${path.format(npath)}`);
	
	console.log(result.output);

	if (result.status === 0) {
		console.log("Removing file");
		// child_process.spawnSync(`rm ${file}`);
	}
}

