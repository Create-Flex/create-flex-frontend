import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, User, MoreHorizontal, Edit3, Trash2, Link as LinkIcon } from 'lucide-react';
import { renderPlatformIcon } from '../../creator/shared/utils';
import {
    Container, ControlBar, SearchGroup, SearchWrapper, SearchIconWrapper, SearchInput, Divider, CountText, AddButton,
    TableWrapper, Table, TableHead, TableHeader, TableBody, TableRow, TableCell,
    DropdownMenu, MenuButton, ActionButton,
    InfoWrapper, AvatarImg, AvatarCreating, NameText, SubText,
    ChannelWrapper, ChannelName, SubscriberCount,
    ContactText, NoDataText, ManagerName, ConnectedBadge, StatusBadge
} from './CreatorList.styled';

export const CreatorList = ({
    creators,
    onOpenAddModal,
    onOpenEditModal,
    onDeleteCreator
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMenuId, setActiveMenuId] = useState(null);
    const menuRef = useRef(null);

    const filteredCreators = creators.filter(c =>
        c.name.includes(searchQuery) ||
        c.channelName?.includes(searchQuery)
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <Container>
            <ControlBar>
                <SearchGroup>
                    <SearchWrapper>
                        <SearchIconWrapper>
                            <Search size={14} />
                        </SearchIconWrapper>
                        <SearchInput
                            type="text"
                            placeholder="크리에이터 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </SearchWrapper>
                    <Divider />
                    <CountText>총 {creators.length}명</CountText>
                </SearchGroup>
                <AddButton onClick={onOpenAddModal}>
                    <Plus size={16} /> 등록
                </AddButton>
            </ControlBar>
            <TableWrapper>
                <Table>
                    <TableHead>
                        <tr>
                            <TableHeader>크리에이터</TableHeader>
                            <TableHeader>채널 정보</TableHeader>
                            <TableHeader>연락처</TableHeader>
                            <TableHeader>담당 매니저</TableHeader>
                            <TableHeader>상태</TableHeader>
                            <TableHeader $center>관리</TableHeader>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {filteredCreators.map(creator => (
                            <TableRow
                                key={creator.id}
                                onClick={() => onOpenEditModal(creator)}
                            >
                                <TableCell>
                                    <InfoWrapper>
                                        {creator.avatarUrl ? (
                                            <AvatarImg src={creator.avatarUrl} alt="" />
                                        ) : (
                                            <AvatarCreating>
                                                <User size={20} />
                                            </AvatarCreating>
                                        )}
                                        <div>
                                            <NameText>{creator.name}</NameText>
                                            <SubText>ID: {creator.loginId || creator.id}</SubText>
                                        </div>
                                    </InfoWrapper>
                                </TableCell>
                                <TableCell>
                                    <ChannelWrapper>
                                        {renderPlatformIcon(creator.platform, 12)}
                                        <ChannelName>{creator.channelName}</ChannelName>
                                    </ChannelWrapper>
                                    <SubscriberCount>구독자 {creator.subscribers}</SubscriberCount>
                                </TableCell>
                                <TableCell>
                                    {creator.contactInfo ? (
                                        <ContactText>{creator.contactInfo}</ContactText>
                                    ) : (
                                        <NoDataText>-</NoDataText>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <ManagerName>{creator.manager}</ManagerName>
                                        {creator.manager && creator.manager !== '담당자 없음' ? (
                                            <ConnectedBadge>
                                                <LinkIcon size={8} />
                                                <span>연결됨</span>
                                            </ConnectedBadge>
                                        ) : (
                                            <SubText style={{ marginTop: '0.125rem' }}>미배정</SubText>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <StatusBadge $status={creator.status}>
                                        {creator.status}
                                    </StatusBadge>
                                </TableCell>
                                <TableCell $center $relative onClick={e => e.stopPropagation()}>
                                    <ActionButton
                                        $active={activeMenuId === creator.id}
                                        onClick={() => setActiveMenuId(activeMenuId === creator.id ? null : creator.id)}
                                    >
                                        <MoreHorizontal size={16} />
                                    </ActionButton>

                                    {activeMenuId === creator.id && (
                                        <DropdownMenu ref={menuRef}>
                                            <MenuButton onClick={() => onOpenEditModal(creator)}>
                                                <Edit3 size={12} /> 정보 수정
                                            </MenuButton>
                                            <MenuButton $danger onClick={() => onDeleteCreator && onDeleteCreator(creator.id)}>
                                                <Trash2 size={12} /> 삭제
                                            </MenuButton>
                                        </DropdownMenu>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableWrapper>
        </Container>
    );
};
