# topic-service

<center>
<img src="https://d30zekycd4jxe2.cloudfront.net/resources/minimum-social.png" alt="minimum-social-logo" />

<h3>minimum-social topic service</h3>

</center>


| 구분 | 내용 |
|:--- | --- |
| Public IPv4 | `3.39.18.222` |
| Public DNS | `ec2-3-39-18-222.ap-northeast-2.compute.amazonaws.com` |
| user-service port | `8000` |
| **topic-service port** | `8001` |

## Swagger

- <a href="http://3.39.18.222:8001/docs">Topic API Document</a>

## Related

- [minimum-social-user](https://github.com/young1ll/minimum-social-user)
- minimum-social-topic
- [minimum-social-front](https://github.com/young1ll/minimum-social-front)

## Issues
#### EC2에서 docker-compose로 REDIS를 사용하는 경우
- 주의: EC2 내에서 의도한 host, port, password 등의 설정으로 실행되고 있는지 반드시 확인해야 합니다.
- EC2의 docker 컨테이너 진입 명령어를 통해 실행 여부, 에러 원인 등을 직접 확인