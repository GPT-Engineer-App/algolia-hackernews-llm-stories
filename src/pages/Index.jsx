import React, { useState, useEffect } from "react";
import { Box, Input, VStack, Heading, Text, Button, IconButton, useToast, Container, Link, List, ListItem, ListIcon, InputGroup, InputRightElement } from "@chakra-ui/react";
import { FaHeart, FaSearch } from "react-icons/fa";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetch(`https://hn.algolia.com/api/v1/search?query=LLMs`)
      .then((response) => response.json())
      .then((data) => setStories(data.hits))
      .catch((error) => console.error("Error fetching stories:", error));
  }, []);

  const handleSearch = () => {
    fetch(`https://hn.algolia.com/api/v1/search?query=LLMs ${searchTerm}`)
      .then((response) => response.json())
      .then((data) => setStories(data.hits))
      .catch((error) => console.error("Error searching stories:", error));
  };

  const addToFavorites = (story) => {
    if (!favorites.some((fav) => fav.objectID === story.objectID)) {
      setFavorites([...favorites, story]);
      toast({
        title: "Added to favorites.",
        description: "This story has been added to your favorites.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Already in favorites.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={5}>
      <VStack spacing={4}>
        <Heading as="h1" size="xl">
          Hacker News LLM Stories
        </Heading>
        <InputGroup>
          <Input placeholder="Search stories by title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <InputRightElement children={<IconButton aria-label="Search" icon={<FaSearch />} onClick={handleSearch} />} />
        </InputGroup>
        <List spacing={3}>
          {stories.map((story) => (
            <ListItem key={story.objectID} p={2} shadow="md">
              <Link href={story.url} isExternal>
                <Text fontWeight="bold">{story.title}</Text>
              </Link>
              <IconButton aria-label="Add to favorites" icon={<FaHeart />} onClick={() => addToFavorites(story)} size="sm" colorScheme="pink" variant="outline" ml={2} />
            </ListItem>
          ))}
        </List>
        <Heading as="h2" size="lg">
          Favorites
        </Heading>
        <List spacing={3}>
          {favorites.map((fav) => (
            <ListItem key={fav.objectID} p={2} shadow="md">
              <Link href={fav.url} isExternal>
                <Text fontWeight="bold">{fav.title}</Text>
              </Link>
              <ListIcon as={FaHeart} color="pink.400" />
            </ListItem>
          ))}
        </List>
      </VStack>
    </Container>
  );
};

export default Index;
