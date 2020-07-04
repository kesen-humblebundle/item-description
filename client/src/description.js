import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

import { getDescription } from "../utils/get_description";
import { getImages } from "../utils/get_images";

const Description = ({ productID }) => {
  let [description, setDescription] = useState("");
  let [title, setTitle] = useState("");
  let [expanded, setExpanded] = useState(false);
  let descElm = null;

  useEffect(() => {
    let desc = getDescription(productID).then((resp) => {
      let paragraphs = resp.description
        .split("\n \r")
        .map((para, i) => (
          <ParagraphWrapper key={"p" + i}>{para}</ParagraphWrapper>
        ));

      setTitle(resp.title);
      getImages().then((imageUrls) => {
        let images = imageUrls.map((url, i) => (
          <ImageWrapper key={"img" + i}>
            <DescImage src={url} />
          </ImageWrapper>
        ));

        let descriptionArr = [];

        for (let i = 0; i < images.length; i++) {
          descriptionArr.push(images[i]);
          descriptionArr.push(paragraphs[i]);
        }

        setDescription(descriptionArr);
      });
    });
  }, []);

  return (
    <div>
      <DescWrapper expanded={expanded}>{description}</DescWrapper>
      <DescToggle onClick={() => setExpanded(!expanded)}>
        <span>
          {expanded ? "Show less" : "Read more"} about {title}{" "}
        </span>
        <IconWrapper>
          {expanded ? (
            <IoMdArrowDropup size="1.8em" />
          ) : (
            <IoMdArrowDropdown size="1.8em" />
          )}
        </IconWrapper>
      </DescToggle>
    </div>
  );
};

export default Description;

const ParagraphWrapper = styled.p`
  font-family: "Sofia Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  margin: 20px;
  line-height: 1.35;
  font-weight: 500;
  background-color: #e4e7ed;
  color: #494f5c;
`;

const ImageWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  align-content: center;
  max-width: 600px;
`;

const DescImage = styled.img`
  width: 100%;
  height: auto;
`;

const DescWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  height: ${(props) => (props.expanded === false ? "345px" : "auto")};
  overflow: hidden;
`;

const DescToggle = styled.div`
  font-family: "Sofia Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  margin: 20px;
  font-weight: 900;
  background-color: #e4e7ed;
  color: #494f5c;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const IconWrapper = styled.div`
  display: inline-block;
  height: 100%;
`;
