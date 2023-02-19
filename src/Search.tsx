import * as React from "react";
import { Searchbar } from 'react-native-paper';

export default function Search(){
    const [searchQuery, setSearchQuery] = React.useState('');

    return (
        <Searchbar value="" style={{borderRadius: 28, marginBottom: 20, marginTop: 10}} placeholder="Search layers ..."/>
    )
}