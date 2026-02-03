/**
 * projects.js - Standalone Project Loader
 * Mimics the al-folio post-header and grid card style
 */

const projectSettings = {
    folder: './projects/',
    files: [
        "os-from-scratch.md",
        "project-2.md"
    ]
};

async function initProjects() {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('project');

    if (projectId) {
        await renderProjectDetail(projectId);
    } else {
        await renderProjectGrid();
    }
}

async function renderProjectGrid() {
    const container = document.getElementById('project-list-container');
    const listView = document.getElementById('view-projects');
    const detailView = document.getElementById('view-blog-detail');

    if (listView) listView.classList.remove('hidden');
    if (detailView) detailView.classList.add('hidden');

    let gridHtml = `<div class="grid grid-cols-1 md:grid-cols-3 gap-6">`;

    for (const file of projectSettings.files) {
        try {
            const res = await fetch(`${projectSettings.folder}${file}`);
            if (!res.ok) continue;
            
            const text = await res.text();
            // Using the existing parseFrontmatter function from your environment
            const { metadata } = parseFrontmatter(text);

            gridHtml += `
                <a href="?project=${file}" class="group block no-underline">
                    <div class="h-full border border-stone-800 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-stone-600 hover:shadow-xl bg-stone-900/20">
                        ${metadata.img ? `
                            <img src="${metadata.img}" alt="${metadata.title}" class="w-full h-40 object-cover grayscale group-hover:grayscale-0 transition-all duration-500">
                        ` : ''}
                        <div class="p-4">
                            <h2 class="text-stone-100 font-semibold text-lg mb-1">${metadata.title}</h2>
                            <p class="text-stone-400 text-xs md:text-sm italic">${metadata.description || ''}</p>
                        </div>
                    </div>
                </a>
            `;
        } catch (e) { console.error(e); }
    }

    gridHtml += `</div>`;
    if (container) container.innerHTML = gridHtml;
}

async function renderProjectDetail(filename) {
    const listView = document.getElementById('view-projects');
    const detailView = document.getElementById('view-blog-detail');

    if (listView) listView.classList.add('hidden');
    if (detailView) detailView.classList.remove('hidden');

    try {
        const res = await fetch(`${projectSettings.folder}${filename}`);
        const text = await res.text();
        const { metadata, content } = parseFrontmatter(text);
        const contentHtml = typeof marked !== 'undefined' ? marked.parse(content) : content;

        detailView.innerHTML = `
            <div class="post mb-20 fade-in">
                <header class="post-header mb-10 border-b border-stone-800 pb-8">
                    <a href="projects.html" class="text-stone-500 hover:text-stone-100 text-xs uppercase tracking-widest mb-6 inline-block transition-colors">← Back to Portfolio</a>
                    <h1 class="text-3xl md:text-5xl font-bold text-white mb-4">${metadata.title}</h1>
                    <p class="text-xl text-stone-400 font-light italic">${metadata.description || ''}</p>
                </header>

                <article class="prose prose-invert prose-stone max-w-none 
                    prose-p:text-stone-200 prose-p:leading-relaxed 
                    prose-headings:text-stone-100 prose-img:rounded-xl">
                    ${contentHtml}
                </article>
            </div>
        `;
        window.scrollTo(0, 0);
    } catch (e) {
        detailView.innerHTML = `<p class="text-red-500">Failed to load project details.</p>`;
    }
}

// Start the script
document.addEventListener('DOMContentLoaded', initProjects);