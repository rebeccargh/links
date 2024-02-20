// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)



// Okay, Are.na stuff!
let channelSlug = 'engaging-with-a-mushroom' // The “slug” is just the end of the URL



// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (data) => {
	// Target some elements in your HTML:
	let channelTitle = document.getElementById('channel-title')
	let channelDescription = document.getElementById('channel-description')
	let channelCount = document.getElementById('channel-count')
	let channelLink = document.getElementById('channel-link')

	// Then set their content/attributes to our data:
	channelTitle.innerHTML = data.title
	channelDescription.innerHTML = window.markdownit().render(data.metadata.description) // Converts Markdown → HTML
	channelCount.innerHTML = data.length
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
}



// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.getElementById('channel-blocks')

	// Links!
	if (block.class == 'Link') {
		let linkItem =
			`
			<liclass= "block block--link">
				<h2>${ block.title }</h2>
				<div>
					<figure>
						<source media="(max-width: 428px)" srcset="${ block.image.thumb.url }">
						<source media="(max-width: 640px)" srcset="${ block.image.large.url }">
						<img src="${ block.image.original.url }">
						<figcaption>
						${ block.description_html }
						</figcaption>
					</figure>
				</div>
				<p><a href="${ block.source.url }">See the original ↗</a></p>
			</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
	}

	// Images!
	else if (block.class == 'Image') {
		// …up to you!
		let imageItem =
			`
			<li class= "block block--img">
				<h2>${ block.title }</h2>
				<div>
					<figure>
						<source media="(max-width: 428px)" srcset="${ block.image.thumb }">
						<source media="(max-width: 640px)" srcset="${ block.image.large }">
						<img src="${ block.image.original.url }">
						<figcaption>
						${ block.description_html }
						</figcaption>
					</figure>
				</div>
			</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', imageItem)
	}

// what does source media string do?
// description html is what you want to pull in
// because we're in a text block, you can use ${} - why?

	// Text!
	else if (block.class == 'Text') {
		// …up to you!
		let textItem =
			`
			<li class="block block--text">
				<h2>${ block.title}</h2>
				<div>${ block.content_html}</div>
			</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', textItem)
	}

	// Uploaded (not linked) media…
	else if (block.class == 'Attachment') {
		let attachment = block.attachment.content_type // Save us some repetition

		// Uploaded videos!
		if (attachment.includes('video')) {
			// …still up to you, but we’ll give you the `video` element:
			let videoItem =
				`
				<liclass= "block block--videoup">
					<h2>${ block.title }</h2>
					<div>
						<video controls src="${ block.attachment.url }"></video>
					</div>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', videoItem)
			// More on video, like the `autoplay` attribute:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
		}

		// Uploaded PDFs!
		else if (attachment.includes('pdf')) {
			// …up to you!
			let pdfItem =
				`
				<li class="block block--pdf">
					<h2> ${ block.title} </h2>
					<div>
						<a href=" ${ block.attachment.url}">
							<figure>
								<source media="(max-width: 428px)" srcset="${ block.image.thumb.url }">
								<source media="(max-width: 640px)" srcset="${ block.image.large.url }">
								<img src="${ block.image.original.url}" alt="${ block.title}">
							</figure>
						</a>	
					</div>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', pdfItem)
		}

		// Uploaded audio!
		else if (attachment.includes('audio')) {
			// …still up to you, but here’s an `audio` element:
			let audioItem =
				`
				<liclass= "block block--audioup">
				<h2>${ block.title }</h2>
					<div>
						<audio controls src="${ block.attachment.url }"></audio>
					</div>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', audioItem)
			// More on audio: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
		}
	}

	// Linked media…
	else if (block.class == 'Media') {
		let embed = block.embed.type

		// Linked video!
		if (embed.includes('video')) {
			// …still up to you, but here’s an example `iframe` element:
			let linkedVideoItem =
				`
				<liclass= "block block--videolink">
				<h2>${ block.title }</h2>
					<div>
						${ block.embed.html }
					</div>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem)
			// More on iframe: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
		}

		// Linked audio!
		else if (embed.includes('rich')) {
			// …up to you!
			let linkedAudioItem =
			`
			<liclass= "block block--audiolink">
				<h2>${ block.title }</h2>
					<div>
						${ block.embed.html}
					</div>
			</li>
			`
			channelBlocks.insertAdjacentHTML('beforeend', linkedAudioItem)
		}
	}
}



// It‘s always good to credit your work:
let renderUser = (user, container) => { // You can have multiple arguments for a function!
	let userAddress =
		`
		<address>
			<h2>${ user.first_name }</h2>
			<p><a href="https://are.na/${ user.slug }">Are.na profile ↗</a></p>
		</address>
		`
	container.insertAdjacentHTML('beforeend', userAddress)
}



// Now that we have said what we can do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data
		console.log(data) // Always good to check your response!
		placeChannelInfo(data) // Pass the data to the first function

		// Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
		data.contents.reverse().forEach((block) => {
			// console.log(block) // The data for a single block
			renderBlock(block) // Pass the single block data to the render function
		})

		// Also display the owner and collaborators:
		let channelUsers = document.getElementById('channel-users') // Show them together
		data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))
		renderUser(data.user, channelUsers)

		let highlightClass = 'breath1' // Variables again.
		let highlightBlocks = document.querySelectorAll('li') // Get all of them.
		
		// Loop through the list, doing this `forEach` one.
		highlightBlocks.forEach((block) => {
			let sectionObserver = new IntersectionObserver((entries) => {
				let [entry] = entries
		
				if (entry.isIntersecting) {
					block.classList.add(highlightClass)
				} else {
					block.classList.remove(highlightClass)
				}
			}, {
				root: document, // This is only needed in the example iframe!
				rootMargin: '-20% 0% -20% 0%', // CSS-ish: top/right/bottom/left.
			})
		
			sectionObserver.observe(block) // Watch each one!
		})
	})

