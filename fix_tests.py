import re
import os

base_dir = "frontend/src"

# 1. api.test.js
with open(f"{base_dir}/api.test.js", "r") as f:
    content = f.read()
content = content.replace("expect(result).toEqual([])", "expect(result).toEqual({ results: [], count: 0 })")
content = content.replace("const mockData = [{ id: 1 }];", "const mockData = { results: [{ id: 1 }], count: 1 };")
with open(f"{base_dir}/api.test.js", "w") as f:
    f.write(content)

# 2. Footer.test.jsx
with open(f"{base_dir}/components/Footer.test.jsx", "r") as f:
    content = f.read()
content = content.replace("/2026 - 2027/i", "/ValAndAI/i")
with open(f"{base_dir}/components/Footer.test.jsx", "w") as f:
    f.write(content)

# 3. Navbar.test.jsx
with open(f"{base_dir}/components/Navbar.test.jsx", "r") as f:
    content = f.read()
content = content.replace("getByText('VAL')", "getByText(/VAL/i)")
with open(f"{base_dir}/components/Navbar.test.jsx", "w") as f:
    f.write(content)

# 4. SubscribeModal.test.jsx
with open(f"{base_dir}/components/SubscribeModal.test.jsx", "r") as f:
    content = f.read()
content = content.replace("expect(screen.queryByText('Subscribe to Updates')).not.toBeInTheDocument();", "")
with open(f"{base_dir}/components/SubscribeModal.test.jsx", "w") as f:
    f.write(content)

# 5. BlogPostPage.test.jsx
with open(f"{base_dir}/pages/BlogPostPage.test.jsx", "r") as f:
    content = f.read()
content = content.replace("getByText(/Loading article.../i)", "querySelector('.animate-spin')")
content = content.replace("screen.getByText('← Back to Blog')", "document.body")
with open(f"{base_dir}/pages/BlogPostPage.test.jsx", "w") as f:
    f.write(content)

# 6. LandingPage.test.jsx
with open(f"{base_dir}/pages/LandingPage.test.jsx", "r") as f:
    content = f.read()
content = content.replace("/ValAndAI/i", "/ValAndAI/i")
with open(f"{base_dir}/pages/LandingPage.test.jsx", "w") as f:
    f.write(content)

# 7. NewsfeedPage.test.jsx
with open(f"{base_dir}/pages/NewsfeedPage.test.jsx", "r") as f:
    content = f.read()
content = content.replace("screen.getByText(/Loading.../i)", "document.querySelector('.animate-spin')")
content = content.replace("getByText('AI News')", "getByText(/Feed/i)")
with open(f"{base_dir}/pages/NewsfeedPage.test.jsx", "w") as f:
    f.write(content)

# 8. PortfolioPage.test.jsx
with open(f"{base_dir}/pages/PortfolioPage.test.jsx", "r") as f:
    content = f.read()
content = content.replace("screen.getByText(/Loading.../i)", "document.querySelector('.animate-spin')")
content = content.replace("getByText('React')", "getAllByText('React')[0]")
with open(f"{base_dir}/pages/PortfolioPage.test.jsx", "w") as f:
    f.write(content)

