import React, { useState } from 'react';
import { Users, Grid, Monitor, Link, AtSign, Building, Briefcase, UserCircle, Mail, Calendar, Pencil, Lock } from 'lucide-react';
import { SectionTitle } from '../ProfileView.styled';
import {
    InfoContainer, SectionHeader, SubSectionHeader, InfoRow, InfoIconWrapper, InfoLabel, InfoValue,
    InfoText, InfoTextBold, InfoTextMedium, SubLabel, ContactList, ContactItem, ContactLabel,
    EditButtonGroup, InfoAnimationWrapper, JoinDateWrapper, ContactInfoWrapper, ContactRow,
    EditFormGrid, InputGroup, Label, Input, EditButton, PasswordButton,
    EditActions, Spacer, MarginLeft
} from './ProfileInfo.styled';

export const ProfileInfo = ({
    profile,
    isCreator,
    readOnly,
    onUpdateProfile,
    onPasswordChangeClick,
    onEditProfileClick
}) => {
    // readOnly가 true일 때(타인이 볼 때) 개인정보를 숨깁니다.
    const hideSensitiveInfo = readOnly;

    return (
        <div>
            <SectionHeader>
                <SectionTitle>인사 정보</SectionTitle>
            </SectionHeader>
            <InfoContainer>
                {isCreator ? (
                    <>
                        <InfoRow>
                            <InfoIconWrapper><Users size={18} /></InfoIconWrapper>
                            <InfoLabel $wide={true}>구독자</InfoLabel>
                            <InfoValue>
                                <InfoTextBold>{profile.subscribers}</InfoTextBold>
                            </InfoValue>
                        </InfoRow>
                        <InfoRow>
                            <InfoIconWrapper><Grid size={18} /></InfoIconWrapper>
                            <InfoLabel $wide={true}>카테고리</InfoLabel>
                            <InfoValue>{profile.category}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                            <InfoIconWrapper><Monitor size={18} /></InfoIconWrapper>
                            <InfoLabel $wide={true}>크리에이터 플랫폼</InfoLabel>
                            <InfoValue>{profile.platform}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                            <InfoIconWrapper><Link size={18} /></InfoIconWrapper>
                            <InfoLabel $wide={true}>매니저 이름</InfoLabel>
                            <InfoValue><InfoTextMedium>{profile.manager}</InfoTextMedium></InfoValue>
                        </InfoRow>
                        
                        {/* [수정] 본인이 아닐 경우 연락처 아예 숨김 */}
                        {!hideSensitiveInfo && (
                            <InfoRow>
                                <InfoIconWrapper><AtSign size={18} /></InfoIconWrapper>
                                <InfoLabel $wide={true}>연락처</InfoLabel>
                                <InfoValue>
                                    <SubLabel>이메일</SubLabel>
                                    <span>{profile.email}</span>
                                </InfoValue>
                            </InfoRow>
                        )}
                    </>
                ) : (
                    <>
                        <InfoRow $alignStart={true}>
                            <InfoIconWrapper $marginTop={true}><Building size={16} /></InfoIconWrapper>
                            <InfoLabel>조직</InfoLabel>
                            <InfoValue>
                                <InfoText>
                                    <SubLabel>소속</SubLabel> {profile.org}
                                </InfoText>
                            </InfoValue>
                        </InfoRow>
                        <InfoRow $alignStart={true}>
                            <InfoIconWrapper $marginTop={true}><Briefcase size={16} /></InfoIconWrapper>
                            <InfoLabel>직무</InfoLabel>
                            <InfoValue>
                                <InfoText>
                                    <SubLabel>수행 직무</SubLabel> {profile.job}
                                </InfoText>
                            </InfoValue>
                        </InfoRow>
                        <InfoRow $alignStart={true}>
                            <InfoIconWrapper $marginTop={true}><AtSign size={16} /></InfoIconWrapper>
                            <InfoLabel>닉네임</InfoLabel>
                            <InfoValue>
                                <InfoText>{profile.nickname || '-'}</InfoText>
                            </InfoValue>
                        </InfoRow>
                        
                        {/* [수정] 본인이 아닐 경우 회사 연락처도 숨김 */}
                        {!hideSensitiveInfo && (
                            <InfoRow $alignStart={true}>
                                <InfoIconWrapper $marginTop={true}><UserCircle size={16} /></InfoIconWrapper>
                                <InfoLabel>연락처</InfoLabel>
                                <InfoValue>
                                    <ContactList>
                                        <ContactItem>
                                            <ContactLabel>이메일</ContactLabel>
                                            <span>{profile.email}</span>
                                        </ContactItem>
                                    </ContactList>
                                </InfoValue>
                            </InfoRow>
                        )}
                    </>
                )}
            </InfoContainer>

            {!isCreator && (
                <div>
                    <SubSectionHeader>
                        <SectionTitle style={{ marginBottom: 0, marginTop: '0.25rem' }}>개인정보</SectionTitle>
                        {!readOnly && (
                            <EditActions>
                                <EditButton onClick={onEditProfileClick}>
                                    <Pencil size={12} /> 정보 수정
                                </EditButton>
                                <PasswordButton onClick={onPasswordChangeClick}>
                                    <Lock size={12} /> 비밀번호 변경
                                </PasswordButton>
                            </EditActions>
                        )}
                    </SubSectionHeader>

                    <InfoContainer>
                        <InfoRow $alignStart={true}>
                            <InfoIconWrapper $marginTop={true}><UserCircle size={18} /></InfoIconWrapper>
                            <InfoLabel $paddingTop={true}>이름</InfoLabel>
                            <InfoValue>
                                <InfoAnimationWrapper>
                                    <SubLabel>본명</SubLabel> {profile.name}
                                    <Spacer><SubLabel>영문 이름</SubLabel> {profile.engName}</Spacer>
                                </InfoAnimationWrapper>
                            </InfoValue>
                        </InfoRow>
                        
                        {/* [수정] 본인이 아닐 경우 개인 연락처(폰,개인메일) 숨김 */}
                        {!hideSensitiveInfo && (
                            <InfoRow $alignStart={true}>
                                <InfoIconWrapper $marginTop={true}><Mail size={16} /></InfoIconWrapper>
                                <InfoLabel $paddingTop={true}>연락처</InfoLabel>
                                <InfoValue>
                                    <ContactInfoWrapper>
                                        <ContactRow>
                                            <ContactLabel>개인 이메일</ContactLabel> {profile.personalEmail}
                                        </ContactRow>
                                        <ContactRow>
                                            <ContactLabel>휴대전화</ContactLabel> {profile.phone}
                                        </ContactRow>
                                    </ContactInfoWrapper>
                                </InfoValue>
                            </InfoRow>
                        )}
                        
                        <InfoRow $alignStart={true}>
                            <InfoIconWrapper $marginTop={true}><Calendar size={16} /></InfoIconWrapper>
                            <InfoLabel $paddingTop={true}>입사 정보</InfoLabel>
                            <InfoValue>
                                <JoinDateWrapper>
                                    <SubLabel>입사일</SubLabel> {profile.joinDate}
                                    <MarginLeft><SubLabel>입사 유형</SubLabel> 경력</MarginLeft>
                                </JoinDateWrapper>
                            </InfoValue>
                        </InfoRow>

                        {/* [수정] 본인이 아닐 경우 주소 숨김 */}
                        {!hideSensitiveInfo && (
                            <InfoRow $alignStart={true}>
                                <InfoIconWrapper $marginTop={true}><Building size={16} /></InfoIconWrapper>
                                <InfoLabel $paddingTop={true}>주소</InfoLabel>
                                <InfoValue>
                                    <InfoText>{profile.address || '-'}</InfoText>
                                </InfoValue>
                            </InfoRow>
                        )}
                    </InfoContainer>
                </div>
            )}
        </div>
    );
};