"use client";

import withAuth from "@utils/protectRoutes";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Skeleton from "@mui/material/Skeleton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Button from "@mui/material/Button";

import AppNavbar from "@src/components/dashboard/components/AppNavbar";
import Header from "@src/components/dashboard/components/Header";
import SideMenu from "@src/components/dashboard/components/SideMenu";
import AppTheme from "@src/components/shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "@src/components/dashboard/theme/customizations";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

type NewsArticle = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
};

const PAGE_SIZE = 10;

function News(props: { disableCustomTheme?: boolean }) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<"technology" | "business">(
    "technology"
  );
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchArticles = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const url =
        `/api/newsdata?category=${category}` +
        (nextPage ? `&page=${nextPage}` : "");
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();

      setArticles((prev) => [...prev, ...data.articles]);
      setNextPage(data.nextPage ?? null);
      setHasMore(!!data.nextPage);
    } catch (err) {
      console.error("Fetch error:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Reset & initial load when category changes
  useEffect(() => {
    setArticles([]);
    setNextPage(null);
    setHasMore(true);
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // Infinite scroll observer
  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchArticles();
        }
      },
      { threshold: 1 }
    );

    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [loading, hasMore]);

  const handleCategoryChange = (
    _: React.MouseEvent<HTMLElement>,
    cat: "technology" | "business" | null
  ) => {
    if (cat && cat !== category) {
      setCategory(cat);
    }
  };

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={3}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header page="News" />

            <ToggleButtonGroup
              color="primary"
              value={category}
              exclusive
              onChange={handleCategoryChange}
              sx={{ mt: 2, mb: 4 }}
            >
              <ToggleButton value="technology">Technology</ToggleButton>
              <ToggleButton value="business">Business</ToggleButton>
            </ToggleButtonGroup>

            {!loading && articles.length === 0 && (
              <Typography mt={4} color="text.secondary">
                No news articles found for “{category}.”
              </Typography>
            )}

            {/* Single‑column list */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                width: "100%",
                maxWidth: 800,
              }}
            >
              {articles.map((a, i) => (
                <Card
                  key={i}
                  sx={{
                    width: "100%",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  {a.urlToImage && (
                    <CardMedia
                      component="img"
                      height="250"
                      image={a.urlToImage}
                      alt={a.title}
                      sx={{ objectFit: "cover", mb: 2, borderRadius: 1 }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {a.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {a.description || "No description available."}
                    </Typography>
                    <Box sx={{ textAlign: "right", mt: 2 }}>
                      <Button
                        variant="contained"
                        size="small"
                        href={a.url}
                        target="_blank"
                        rel="noopener"
                      >
                        Read more
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}

              {loading &&
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <Card key={i} sx={{ width: "100%" }}>
                    <Skeleton variant="rectangular" height={250} />
                    <CardContent>
                      <Skeleton width="80%" height={30} />
                      <Skeleton width="100%" height={20} />
                      <Skeleton width="60%" height={20} />
                    </CardContent>
                  </Card>
                ))}
            </Box>

            {/* loader anchor */}
            <Box ref={loaderRef} sx={{ height: 1 }} />

            {!hasMore && !loading && articles.length > 0 && (
              <Typography mt={2} color="text.secondary">
                You've reached the end of the news feed.
              </Typography>
            )}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}

export default withAuth(News);
