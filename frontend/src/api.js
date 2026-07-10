const API_BASE_URL = 'https://valandaicom-backend-211504890015.us-central1.run.app/api';

export const fetchPortfolio = async () => {
    try {
        const [projectsRes, experiencesRes, skillsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/portfolio/projects/`),
            fetch(`${API_BASE_URL}/portfolio/experiences/`),
            fetch(`${API_BASE_URL}/portfolio/skills/`)
        ]);
        
        return {
            projects: await projectsRes.json(),
            experiences: await experiencesRes.json(),
            skills: await skillsRes.json()
        };
    } catch (error) {
        console.error("Error fetching portfolio:", error);
        return { projects: [], experiences: [], skills: [] };
    }
};

export const fetchBlogPosts = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/blog/posts/`);
        return await res.json();
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return [];
    }
};

export const fetchBlogPost = async (slug) => {
    try {
        const res = await fetch(`${API_BASE_URL}/blog/posts/${slug}/`);
        if (!res.ok) throw new Error("Post not found");
        return await res.json();
    } catch (error) {
        console.error("Error fetching blog post:", error);
        return null;
    }
};

export const incrementPostView = async (slug) => {
    try {
        await fetch(`${API_BASE_URL}/blog/posts/${slug}/view/`, { method: 'POST' });
    } catch (error) {
        console.error("Error incrementing view count:", error);
    }
};

export const likePost = async (slug) => {
    try {
        const res = await fetch(`${API_BASE_URL}/blog/posts/${slug}/like/`, { method: 'POST' });
        return await res.json();
    } catch (error) {
        console.error("Error liking post:", error);
        return null;
    }
};

export const unlikePost = async (slug) => {
    try {
        const res = await fetch(`${API_BASE_URL}/blog/posts/${slug}/unlike/`, { method: 'POST' });
        return await res.json();
    } catch (error) {
        console.error("Error unliking post:", error);
        return null;
    }
};

export const dislikePost = async (slug) => {
    try {
        const res = await fetch(`${API_BASE_URL}/blog/posts/${slug}/dislike/`, { method: 'POST' });
        return await res.json();
    } catch (error) {
        console.error("Error disliking post:", error);
        return null;
    }
};

export const undislikePost = async (slug) => {
    try {
        const res = await fetch(`${API_BASE_URL}/blog/posts/${slug}/undislike/`, { method: 'POST' });
        return await res.json();
    } catch (error) {
        console.error("Error undisliking post:", error);
        return null;
    }
};

export const fetchComments = async (slug) => {
    try {
        const res = await fetch(`${API_BASE_URL}/blog/posts/${slug}/comments/`);
        if (!res.ok) throw new Error('Failed to fetch comments');
        return await res.json();
    } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
    }
};

export const postComment = async (slug, name, content) => {
    try {
        const res = await fetch(`${API_BASE_URL}/blog/posts/${slug}/comments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, content })
        });
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.detail || 'Failed to post comment');
        }
        return await res.json();
    } catch (error) {
        console.error("Error posting comment:", error);
        throw error;
    }
};

export const fetchNewsfeed = async (page = 1) => {
    try {
        const res = await fetch(`${API_BASE_URL}/newsfeed/items/?page=${page}`);
        return await res.json();
    } catch (error) {
        console.error("Error fetching newsfeed:", error);
        return { results: [], count: 0 };
    }
};

export const subscribeEmail = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/subscribers/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error(`Server returned an unexpected response (${response.status}). The backend might still be deploying.`);
        }

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.email?.[0] || 'Subscription failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error subscribing:", error);
        throw error;
    }
};
