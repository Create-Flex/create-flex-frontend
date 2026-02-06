import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../api/authService';
import { creatorService } from '../../../api/creatorService';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useUserStore } from '../../../stores/useUserStore';
import * as S from './Login.styled';

import logoImg from '../../../assets/creator-flex.png';


import bgImg from '../../../assets/MCN.png';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { setUserProfile } = useUserStore();

  const [formData, setFormData] = useState({
    memberAccount: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.memberAccount || !formData.password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 1. 백엔드 로그인 API 호출
      const loginResponse = await authService.login({
        memberAccount: formData.memberAccount,
        password: formData.password
      });

      // 2. 토큰 저장 (백엔드는 'accesstoken'으로 반환)
      const token = loginResponse.accesstoken;

      // 3. 토큰으로 사용자 정보 가져오기
      // JWT 토큰을 먼저 localStorage에 저장해야 getMyInfo가 동작함
      localStorage.setItem('token', token);

      try {
        const userInfo = await authService.getMyInfo();

        // 4. Zustand 스토어에 인증 정보 저장
        const authUser = {
          ...userInfo,
          id: userInfo.memberId || userInfo.id
        };
        login(authUser, token);

        // 5. 프로필 설정 (백엔드 데이터만 사용)
        let newProfile = null;
        const role = userInfo.memberRole || userInfo.role;

        if (role === 'ADMINISTRATOR') {
          newProfile = {
            employeeId: String(userInfo.memberId),
            name: userInfo.memberName,
            email: userInfo.corporEmail || userInfo.memberAccount,
            role: userInfo.memberRole,
            avatarUrl: userInfo.profileImage || '',
            coverUrl: userInfo.profileBanner || '',
            job: userInfo.task || '-',
            nickname: userInfo.nickname || '',
            org: userInfo.departmentName || '-',
            engName: userInfo.engName || '',
            personalEmail: userInfo.personalEmail || '',
            phone: userInfo.personalCall || '',
            joinDate: userInfo.hireDate || '',
            address: userInfo.address || '',
            vacationRemainder: userInfo.vacationRemainder || 0,
            rank: '관리자'
          };
        } else if (role === 'CREATOR') {
          // 크리에이터 상세 정보 조회
          try {
            const creatorInfo = await creatorService.getCreatorById(userInfo.memberId);
            newProfile = {
              employeeId: String(userInfo.memberId),
              name: creatorInfo.member_name || userInfo.memberName,
              email: creatorInfo.member_account || userInfo.memberAccount,
              role: 'CREATOR',
              avatarUrl: creatorInfo.profile_image || userInfo.profileImage || '',
              coverUrl: creatorInfo.profile_banner || userInfo.profileBanner || '',
              job: 'Creator',
              org: 'MCN',
              rank: '-',
              // 크리에이터 전용 필드
              subscribers: creatorInfo.creator_subscribe || '',
              category: creatorInfo.creator_category || '',
              platform: creatorInfo.creator_platform || '',
              managerName: creatorInfo.manager_name || '',
              creatorStatus: creatorInfo.creator_status || '',
            };
          } catch (creatorError) {
            console.error('크리에이터 상세 정보 조회 실패:', creatorError);
            // 기본 프로필로 설정
            newProfile = {
              name: userInfo.memberName,
              job: 'Creator',
              org: 'MCN',
              rank: '-',
              avatarUrl: userInfo.profileImage || '',
              coverUrl: userInfo.profileBanner || '',
              employeeId: String(userInfo.memberId),
            };
          }
        } else {
          // 일반 직원
          newProfile = {
            employeeId: String(userInfo.memberId),
            name: userInfo.memberName,
            email: userInfo.corporEmail || userInfo.memberAccount,
            role: userInfo.memberRole,
            avatarUrl: userInfo.profileImage || '',
            coverUrl: userInfo.profileBanner || '',
            job: userInfo.task || '-',
            nickname: userInfo.nickname || '',
            org: userInfo.departmentName || '-',
            engName: userInfo.engName || '',
            personalEmail: userInfo.personalEmail || '',
            phone: userInfo.personalCall || '',
            joinDate: userInfo.hireDate || '',
            address: userInfo.address || '',
            vacationRemainder: userInfo.vacationRemainder || 0,
            rank: '사원'
          };
        }
        setUserProfile(newProfile);

        // 6. 역할별 페이지 리다이렉트
        switch (role) {
          case 'ADMINISTRATOR':
            navigate('/mypage');
            break;
          case 'CREATOR':
            navigate('/mypage');
            break;
          case 'EMPLOYEE':
          case 'MANAGER':
            navigate('/mypage');
            break;
          default:
            navigate('/mypage');
        }
      } catch (infoError) {
        console.error('사용자 정보 조회 실패:', infoError);
        // 사용자 정보 조회 실패 시에도 토큰은 유효하므로 기본 페이지로 이동
        login({ memberAccount: formData.memberAccount }, token);
        navigate('/mypage');
      }

    } catch (err) {
      console.error('로그인 실패:', err);

      // 로그인 실패 시 토큰 제거
      localStorage.removeItem('token');

      if (err.code === 'ERR_NETWORK') {
        // 1. 네트워크 에러 (백엔드 서버 다운 등)
        setError('시스템에 접속할 수 없습니다. 관리자에게 문의해주세요.');
      } else {
        // 2. 그 외 모든 에러는 백엔드에서 보내준 메시지를 그대로 표시
        // GlobalExceptionHandler가 반환하는 ErrorResponse의 message 필드 사용
        setError(err.response?.data?.message || '로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.Container style={{ backgroundImage: `url(${bgImg})` }}>
      <S.Overlay />

      <S.LoginCard>
        <S.Header>
          <S.LogoBox>
            <img src={logoImg} alt="creator-flex logo" />
          </S.LogoBox>
          <S.Title>creator-flex</S.Title>
          <S.SubTitle>직원 관리 시스템</S.SubTitle>
        </S.Header>

        <S.Form onSubmit={handleSubmit}>
          <S.FormGroup>
            <S.Label>사번</S.Label>
            <S.Input
              type="text"
              name="memberAccount"
              value={formData.memberAccount}
              onChange={handleChange}
              placeholder="사번을 입력하세요 (예: HR001)"
              disabled={isLoading}
              autoComplete="username"
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>비밀번호</S.Label>
            <S.Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </S.FormGroup>

          {error && (
            <S.ErrorBox>
              <S.ErrorText>{error}</S.ErrorText>
            </S.ErrorBox>
          )}

          <S.SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </S.SubmitButton>
        </S.Form>

      </S.LoginCard>
    </S.Container>
  );
};

export default Login;