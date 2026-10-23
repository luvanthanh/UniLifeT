import { escapeHtml, parseApiResponse, safeHttpUrl } from "./common.js";

const postsList = document.querySelector("#posts-list");
const notice = document.querySelector("#posts-notice");

function formatPostDate(value) {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("vi-VN");
}

function renderPosts(posts, images) {
    if (!posts.length) {
        postsList.innerHTML = '<p class="posts-empty">API hiện chưa có bài viết.</p>';
        return;
    }

    postsList.innerHTML = posts.map(post => {
        const postImages = images.filter(image => String(image.postId) === String(post.postId));
        const imageUrl = safeHttpUrl(postImages[0]?.imageUrl);
        const date = formatPostDate(post.postCreateAt);
        const image = imageUrl
            ? `<div class="post-image"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(postImages[0].imageName || post.postTitle || "Ảnh bài viết")}" loading="lazy"></div>`
            : "";
        const metadata = [
            date ? `<time datetime="${escapeHtml(new Date(post.postCreateAt).toISOString())}">${escapeHtml(date)}</time>` : "",
            post.postView !== null && post.postView !== undefined && post.postView !== ""
                && Number.isFinite(Number(post.postView))
                ? `<span>${escapeHtml(post.postView)} lượt xem</span>`
                : ""
        ].filter(Boolean).join("");

        return `<article class="post-card">
          ${image}
          <div class="post-content">
            ${metadata ? `<div class="post-meta">${metadata}</div>` : ""}
            ${post.postTitle ? `<h2 class="post-title">${escapeHtml(post.postTitle)}</h2>` : ""}
            ${post.postContent ? `<p class="post-body">${escapeHtml(post.postContent)}</p>` : ""}
            ${post.postStatus ? `<span class="post-status">${escapeHtml(post.postStatus)}</span>` : ""}
          </div>
        </article>`;
    }).join("");
}

async function loadPosts() {
    try {
        const postsResponse = await fetch("http://localhost:8080/posts");
        const posts = await parseApiResponse(postsResponse);
        if (!Array.isArray(posts)) {
            throw new Error("API bài viết trả về dữ liệu không đúng định dạng.");
        }

        let images = [];
        try {
            const imagesResponse = await fetch("http://localhost:8080/post-images");
            const imageData = await parseApiResponse(imagesResponse);
            if (!Array.isArray(imageData)) {
                throw new Error("API hình ảnh bài viết trả về dữ liệu không đúng định dạng.");
            }
            images = imageData;
        } catch (error) {
            notice.textContent = `Không tải được hình ảnh bài viết: ${error.message}`;
            notice.classList.add("error");
            notice.hidden = false;
        }

        renderPosts(posts, images);
    } catch (error) {
        postsList.innerHTML = '<p class="posts-empty">Không tải được danh sách bài viết.</p>';
        notice.textContent = error.message;
        notice.classList.add("error");
        notice.hidden = false;
    }
}

loadPosts();
