import { FC } from "react";
import { ActionIcon, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import "./style.css";

type SearchProps = {
  searchTxt: string;
  placeholder?: string;
  errorName: string;
  onSearchChanged: (e: any) => void;
  onSearchSubmit: (e: any) => void;
};

const SearchInput: FC<SearchProps> = ({
  searchTxt,
  placeholder,
  errorName,
  onSearchChanged,
  onSearchSubmit,
}) => {
  return (
    <div className="search__input">
      <form onSubmit={onSearchSubmit}>
        <TextInput
          rightSection={
            <ActionIcon
              aria-label="Gradient action icon"
              gradient={{ from: "blue", to: "cyan", deg: 90 }}
            >
              <IconSearch />
            </ActionIcon>
          }
          error={errorName}
          onChange={(e: any) => onSearchChanged(e)}
          value={searchTxt}
          placeholder={placeholder}
          radius={"md"}
          size={"md"}
        />
      </form>
    </div>
  );
};

export default SearchInput;
