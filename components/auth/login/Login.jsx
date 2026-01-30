import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../api/authService';
import { useAuthStore } from '../../../stores/useAuthStore';
import * as S from './Login.styled';

const BACKGROUND_IMAGE_URL = "assets/MCN.png";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

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

        // 4. Zustand 스토어에 저장
        login(userInfo, token);

        // 5. 역할별 페이지 리다이렉트
        switch (userInfo.memberRole || userInfo.role) {
          case 'ADMINISTRATOR':
            navigate('/mypage');
            break;
          case 'CREATOR':
            navigate('/creator-schedule');
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

      if (err.response?.status === 401) {
        setError('아이디 또는 비밀번호가 일치하지 않습니다.');
      } else if (err.response?.status === 404) {
        setError('존재하지 않는 사용자입니다.');
      } else if (err.code === 'ECONNABORTED') {
        setError('서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
      } else {
        setError(err.response?.data?.message || '로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.Container style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}>
      <S.Overlay />

      <S.LoginCard>
        <S.Header>
          <S.LogoBox>N</S.LogoBox>
          <S.Title>HR Workspace</S.Title>
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

        <S.Footer>
          <S.FooterTitle>테스트 계정 정보</S.FooterTitle>
          <S.FooterContent>
            <S.TestAccountBadge>관리자: HR001 / admin123!</S.TestAccountBadge>
            <S.TestAccountBadge>매니저: MG001 / manager123</S.TestAccountBadge>
            <S.TestAccountBadge>크리에이터: gamst / gam12345</S.TestAccountBadge>
          </S.FooterContent>
        </S.Footer>
      </S.LoginCard>
    </S.Container>
  );
};

export default Login;