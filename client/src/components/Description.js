import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

import { getDescription } from "../../utils/get_description";
import { getImages } from "../../utils/get_images";

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
          descriptionArr.push(paragraphs[i]);
          descriptionArr.push(images[i]);
        }

        setDescription(descriptionArr);
      });
    });
  }, [productID]);

  return (
    <div>
      <DescWrapper expanded={expanded}>
        <TitleWrapper>
          <Title>{title}</Title> is provided via Steam for Windows. A free Steam
          account is required.
        </TitleWrapper>
        {description}
      </DescWrapper>
      <DescToggle expanded={expanded} onClick={() => setExpanded(!expanded)}>
        <ToggleText>
          <span>
            {expanded ? "Show less" : "Read more"} about <Title>{title}</Title>{" "}
          </span>
          <IconWrapper>
            {expanded ? (
              <IoMdArrowDropup size="1.8em" />
            ) : (
              <IoMdArrowDropdown size="1.8em" />
            )}
          </IconWrapper>
        </ToggleText>
      </DescToggle>
    </div>
  );
};

export default Description;

const Title = styled.span`
  font-style: italic;
`;

const TitleWrapper = styled.div`
  font-family: "Sofia Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  margin: 20px;
  line-height: 1.35;
  align-self: flex-start;
  font-weight: 700;
  background-color: #e4e7ed;
  color: #494f5c;
`;

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
  position: relative;
  display: flex;
  align-items: flex-start;
  align-content: center;
  flex-direction: column;
  width: 100%;
  justify-content: flex-end;
  font-family: "Sofia Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  margin-top: ${(props) => (props.expanded ? "20px" : "-150px")};
  font-weight: 900;
  background-color: rgba(288, 231, 237, 0);
  z-index: 5;
  background-image: linear-gradient(
    rgba(228, 231, 237, 0),
    rgba(228, 231, 237, 0.2),
    rgba(228, 231, 237, 0.3),
    rgba(228, 231, 237, 0.5),
    rgba(228, 231, 237, 0.9),
    rgba(228, 231, 237, 0.9),
    rgba(228, 231, 237, 0.9),
    rgba(228, 231, 237, 0.9),
    rgba(228, 231, 237, 1)
  );
  height: ${({ expanded }) => (expanded ? "auto" : "150px")};
  color: #494f5c;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const ToggleText = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-content: center;
  align-items: center;
  width: 100%;
  background-color: #e4e7ed;
`;

const IconWrapper = styled.div`
  display: inline-block;
  margin-top: 3px;
`;
